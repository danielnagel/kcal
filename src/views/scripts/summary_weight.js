(async () => {

    const response = await fetch('/weight');
    const data = await response.json();
    const dates = data.map(item => item.date);
    const weights = data.map(item => item.weight);

    new Chart(
        document.getElementById('summary-weight'),
        {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'weight',
                        data: weights
                    }
                ]
            },
            options: {
                responsive: true,
            }
        });
})();
