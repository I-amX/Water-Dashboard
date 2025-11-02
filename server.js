// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Database setup
const dbPath = path.join(__dirname, "data", "wash.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to wash.db database.");
  }
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS operations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lga TEXT,
    hours_supply REAL,
    customers_served INTEGER,
    collection_efficiency REAL,
    capacity_utilization REAL,
    non_revenue_water REAL,
    submitted_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// API endpoint — Add new record
app.post("/api/data", (req, res) => {
  const {
    lga,
    hours_supply,
    customers_served,
    collection_efficiency,
    capacity_utilization,
    non_revenue_water,
    submitted_by
  } = req.body;

  const query = `
    INSERT INTO operations (
      lga, hours_supply, customers_served, collection_efficiency,
      capacity_utilization, non_revenue_water, submitted_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      lga,
      hours_supply,
      customers_served,
      collection_efficiency,
      capacity_utilization,
      non_revenue_water,
      submitted_by
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true, id: this.lastID });
      }
    }
  );
});

// API endpoint — Get all records
app.get("/api/data", (req, res) => {
  db.all("SELECT * FROM operations ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
