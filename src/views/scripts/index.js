(async () => {

    

    const response = await fetch('/kcal?for=today');
    const data = await response.json()
    document.getElementById("today-calories").innerText = `calories: ${data.kcal}`
    document.getElementById("today-last-meal").innerText = `last meal: ${data.date}`
})();