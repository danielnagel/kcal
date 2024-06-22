let chartInstance = undefined;

const renderChart = (data) => {
    if (!Array.isArray(data)) return;
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

const renderWeightTarget = async (data) => {
    const container = document.getElementById("summary-weight-container");
    const text = document.createElement("p");
    text.innerHTML = `Target is <strong>${data.weightTarget}kg</strong>.`
    const text2 = document.createElement("p")
    text2.innerHTML = `When losing <strong>two kilos per Month</strong>, the goal is reached in <strong>${data.twoKiloPrediction}</strong>.`
    const text3 = document.createElement("p")
    text3.innerHTML = `When losing <strong>one kilo per Month</strong>, the goal is reached in <strong>${data.oneKiloPrediction}</strong>.`
    container.appendChild(text);
    container.appendChild(text2);
    container.appendChild(text3);
}

(async () => {
    const user = promptUser();
    if(user) {
        const response = await fetch(`/api/weight?user=${user}`);
        renderChart(await response.json());
        const targetResponse = await fetch(`/api/weight?summary=true&user=${user}`);
        renderWeightTarget(await targetResponse.json())
        serviceWorkerOnMessageHandler(renderChart);
    }
})();
