const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// File-based “database”
const DATA_FILE = path.join(__dirname, "data", "data.json");

// Ensure data folder and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// Helper functions
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    console.error("Error reading data.json:", err);
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API — Add new record
app.post("/submit", (req, res) => {
  const data = req.body;
  const allData = readData();

  const newEntry = {
    id: Date.now(),
    lga: data.lga,
    hours_supply: Number(data.hours_supply),
    customers_served: Number(data.customers_served),
    collection_efficiency: Number(data.collection_efficiency),
    capacity_utilization: Number(data.capacity_utilization),
    non_revenue_water: Number(data.non_revenue_water),
    submitted_by: data.submitted_by,
    timestamp: new Date().toISOString(),
  };

  allData.push(newEntry);
  writeData(allData);

  res.json({ message: "✅ Data saved successfully", entry: newEntry });
});

// API — Get all records
app.get("/api/data", (req, res) => {
  res.json(readData());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
