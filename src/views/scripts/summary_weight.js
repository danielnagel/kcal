(async () => {
    const response = await fetch('/api/weight');
    const data = await response.json();
    const date = data.map(item => item.date);
    const weight = data.map(item => item.weight);
    const waist = data.map(item => item.waist);

    new Chart(
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
})();
