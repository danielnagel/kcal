const renderProgressBar = (is, goal) => {
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar")
    progressBar.style.width = calculateProgress(is, goal) + '%';
    const container = document.createElement("div");
    container.classList.add("progress-container");
    container.appendChild(progressBar);
    return container;
}

const calculateProgress = (is, goal) => {
    return Math.round(is / goal * 100);
}

const renderProgressInfoContainer = (labelText, is, goal) => {
    const container = document.createElement("div");
    container.classList.add("progress-info-container");
    const label = document.createElement("p");
    label.style.margin = 0;
    label.innerText = `${labelText} calories: ${is} of ${goal}`;
    container.appendChild(label);
    container.appendChild(renderProgressBar(is, goal));
    document.getElementById("daily-info-container").appendChild(container);
}

const removeProgressInfoContainer = () => {
    document.querySelectorAll('.progress-info-container').forEach(e => e.remove());
}

const renderDailyCalories = (data) => {
    removeProgressInfoContainer();
    if (typeof data.lastMealTime !== "undefined" && typeof data.lastMealAgo !== "undefined") {
        document.getElementById("today-last-meal").innerText = `last meal: ${data.lastMealTime} (${data.lastMealAgo}h ago)`;
    }

    if (typeof data.todayKcal !== "undefined" && typeof data.dailyKcalTarget !== "undefined") {
        renderProgressInfoContainer("today", data.todayKcal, data.dailyKcalTarget);
    }

    if (Array.isArray(data.pastDailyKcal) && typeof data.dailyKcalTarget !== "undefined") {
        data.pastDailyKcal.forEach(d => {
            if (typeof d.date !== "undefined" && typeof d.kcal !== "undefined") {
                renderProgressInfoContainer(d.date, d.kcal, data.dailyKcalTarget);
            }
        })
    }
}

(async () => {
    const response = await fetch('/api/kcal?for=today');
    renderDailyCalories(await response.json());
    serviceWorkerOnMessageHandler(renderDailyCalories);
})();