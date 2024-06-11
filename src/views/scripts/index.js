const renderDailyCalories = (data) => {
    if (typeof data.kcal !== "undefined" && typeof data.dailyKcalTarget !== "undefined") {
        document.getElementById("today-calories").innerText = `today calories: ${data.kcal} of ${data.dailyKcalTarget}`;
        const progress = Math.round(data.kcal / data.dailyKcalTarget * 100) ;
        document.getElementById('progress-bar').style.width = progress + '%';
    }
    if (typeof data.date !== "undefined") document.getElementById("today-last-meal").innerText = `last meal: ${data.date} (${data.ago}h ago)`
}

(async () => {
    const response = await fetch('/api/kcal?for=today');
    renderDailyCalories(await response.json());
    serviceWorkerOnMessageHandler(renderDailyCalories);
})();