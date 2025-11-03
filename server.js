const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

let db;

// ✅ Only use SQLite locally (not in production)
if (process.env.NODE_ENV !== "production") {
  const sqlite3 = require("sqlite3").verbose();
  db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
      console.error("❌ Error opening database:", err.message);
    } else {
      console.log("✅ Connected to local SQLite database.");
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
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
  });
} else {
  console.log("⚠️ Running in production mode — skipping SQLite setup.");
}
const PORT = process.env.PORT || 3000;

// API endpoint — Add new record
app.post("/submit", (req, res) => {
  const data = req.body;

  if (db) {
    // Save only when SQLite is active
    db.run(
      `INSERT INTO operations (lga, hours_supply, customers_served, collection_efficiency, capacity_utilization, non_revenue_water, submitted_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.lga,
        data.hours_supply,
        data.customers_served,
        data.collection_efficiency,
        data.capacity_utilization,
        data.non_revenue_water,
        data.submitted_by,
      ],
      (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Database insert error" });
        } else {
          res.json({ message: "Data saved successfully (local mode)" });
        }
      }
    );
  } else {
    // No DB on Render, but we still respond OK
    console.log("Render mode — skipping database insert.");
    res.json({ message: "Data received (Render mode, not saved)." });
  }
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
