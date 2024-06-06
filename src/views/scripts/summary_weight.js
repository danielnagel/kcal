let chartInstance = undefined;

const renderChart = (data) => {
    if (chartInstance) chartInstance.destroy();
    
    const date = data.map(item => item.date);
    const weight = data.map(item => item.weight);
    const waist = data.map(item => item.waist);

    chartInstance = new Chart(
        document.getElementById('summary-weight'),
        {
            type: 'line',
            data: {
                labels: date,
                datasets: [
                    {
                        label: 'weight',
                        data: weight
                    },
                    {
                        label: 'waist',
                        data: waist
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            },
        });
}

(async () => {
    const response = await fetch('/api/weight');
    renderChart(await response.json());
    serviceWorkerOnMessageHandler(renderChart);
})();
