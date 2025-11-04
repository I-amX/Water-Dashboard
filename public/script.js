const form = document.getElementById("washForm");
const ctx = document.getElementById("operationsChart").getContext("2d");
const dataTable = document.querySelector("#dataTable tbody");

// Chart initialization
let operationsChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Hours of Supply (hrs)",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Collection Efficiency (%)",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Capacity Utilization (%)",
        data: [],
        backgroundColor: "rgba(255, 206, 86, 0.7)",
      },
      {
        label: "Non-Revenue Water (%)",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Performance Indicators" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Value" } },
    },
  },
});

// Fetch data from backend and refresh dashboard
async function loadDashboard() {
  const response = await fetch("/api/data");
  const data = await response.json();
  updateDashboard(data);
}

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEntry = {
    lga: document.getElementById("lga").value,
    hours_supply: Number(document.getElementById("hours_supply").value),
    customers_served: Number(document.getElementById("customers_served").value),
    collection_efficiency: Number(document.getElementById("collection_efficiency").value),
    capacity_utilization: Number(document.getElementById("capacity_utilization").value),
    non_revenue_water: Number(document.getElementById("non_revenue_water").value),
    submitted_by: document.getElementById("submitted_by").value,
  };

  await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEntry),
  });

  form.reset();
  await loadDashboard(); // refresh immediately after submit
});

// Update chart and summary table
function updateDashboard(data) {
  // Chart
  operationsChart.data.labels = data.map((d) => d.lga);
  operationsChart.data.datasets[0].data = data.map((d) => d.hours_supply);
  operationsChart.data.datasets[1].data = data.map((d) => d.collection_efficiency);
  operationsChart.data.datasets[2].data = data.map((d) => d.capacity_utilization);
  operationsChart.data.datasets[3].data = data.map((d) => d.non_revenue_water);
  operationsChart.update();

  // Table
  dataTable.innerHTML = "";
  data.forEach((d) => {
    const row = `
      <tr>
        <td>${d.lga}</td>
        <td>${d.hours_supply} hrs</td>
        <td>${d.customers_served.toLocaleString()}</td>
        <td>${d.collection_efficiency}%</td>
        <td>${d.capacity_utilization}%</td>
        <td>${d.non_revenue_water}%</td>
        <td>${d.submitted_by}</td>
      </tr>`;
    dataTable.insertAdjacentHTML("beforeend", row);
  });
}

// Auto-refresh every 10 seconds
setInterval(loadDashboard, 10000);
loadDashboard();
