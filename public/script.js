const form = document.getElementById('washForm');
const ctx = document.getElementById('operationsChart').getContext('2d');
const dataTable = document.querySelector('#dataTable tbody');

// Store all submissions
let dashboardData = [];

// Initialize Chart.js chart
let operationsChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Hours of Supply (hrs)',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Collection Efficiency (%)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Capacity Utilization (%)',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
      },
      {
        label: 'Non-Revenue Water (%)',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Water Utility Performance Indicators' }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Value' } }
    }
  }
});

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newEntry = {
    lga: document.getElementById('lga').value,
    hours_supply: Number(document.getElementById('hours_supply').value),
    customers_served: Number(document.getElementById('customers_served').value),
    collection_efficiency: Number(document.getElementById('collection_efficiency').value),
    capacity_utilization: Number(document.getElementById('capacity_utilization').value),
    non_revenue_water: Number(document.getElementById('non_revenue_water').value),
    submitted_by: document.getElementById('submitted_by').value,
  };

  dashboardData.push(newEntry);
  updateDashboard();

  form.reset();
});

// Update chart and table dynamically
function updateDashboard() {
  // Update chart labels and datasets
  operationsChart.data.labels = dashboardData.map(d => d.lga);
  operationsChart.data.datasets[0].data = dashboardData.map(d => d.hours_supply);
  operationsChart.data.datasets[1].data = dashboardData.map(d => d.collection_efficiency);
  operationsChart.data.datasets[2].data = dashboardData.map(d => d.capacity_utilization);
  operationsChart.data.datasets[3].data = dashboardData.map(d => d.non_revenue_water);
  operationsChart.update();

  // Update summary table
  dataTable.innerHTML = '';
  dashboardData.forEach(d => {
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
    dataTable.insertAdjacentHTML('beforeend', row);
  });
}
