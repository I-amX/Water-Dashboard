// script.js

const form = document.getElementById("washForm");
const ctx = document.getElementById("operationsChart").getContext("2d");

let chart;

// Function to fetch and render data
async function loadData() {
  const res = await fetch("/api/data");
  const data = await res.json();

  const labels = data.map(d => d.lga);
  const hours = data.map(d => d.hours_supply);
  const efficiency = data.map(d => d.collection_efficiency);
  const utilization = data.map(d => d.capacity_utilization);
  const nonRevenue = data.map(d => d.non_revenue_water);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Hours of Water Supply per Day",
          data: hours,
          backgroundColor: "rgba(54, 162, 235, 0.7)"
        },
        {
          label: "Collection Efficiency (%)",
          data: efficiency,
          backgroundColor: "rgba(255, 206, 86, 0.7)"
        },
        {
          label: "Capacity Utilization (%)",
          data: utilization,
          backgroundColor: "rgba(75, 192, 192, 0.7)"
        },
        {
          label: "Non-Revenue Water (%)",
          data: nonRevenue,
          backgroundColor: "rgba(255, 99, 132, 0.7)"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newData = {
    lga: document.getElementById("lga").value,
    hours_supply: document.getElementById("hours_supply").value,
    customers_served: document.getElementById("customers_served").value,
    collection_efficiency: document.getElementById("collection_efficiency").value,
    capacity_utilization: document.getElementById("capacity_utilization").value,
    non_revenue_water: document.getElementById("non_revenue_water").value,
    submitted_by: document.getElementById("submitted_by").value
  };

  await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newData)
  });

  form.reset();
  loadData();
});

// Initial load
loadData();
