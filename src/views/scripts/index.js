const loadTodayKcalData = async () => {
    const response = await fetch('/kcal?for=today');
    return response.json()
}

const main = async () => {
    const data = await loadTodayKcalData();
    document.getElementById("today-calories").innerText = `calories: ${data.kcal}`
    document.getElementById("today-last-meal").innerText = `last meal: ${data.date}`
}

main();