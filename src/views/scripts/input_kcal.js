const renderSuggestionList = (data) => {
    // build suggestion list
    const what = data.map(item => item.what);
    const detaillist = document.getElementById("suggestion-list");
    what.forEach(item => {
        const option = document.createElement("option");
        option.setAttribute("value", item);
        detaillist.appendChild(option);
    });

    // paste kcal to from selected suggestion into kcal field
    const whatInput = document.getElementById("what");
    const kcalInput = document.getElementById("kcal");
    whatInput.addEventListener("input", () => {
        if (what.includes(whatInput.value)) {
            const filteredData = data.filter(item => item.what === whatInput.value);
            if (filteredData.length > 0) {
                kcalInput.value = filteredData[0].kcal;
            }
        }
    });
}

(async () => {
    const datetimeInput = document.querySelector("input[type=datetime-local]");
    datetimeInput.value = `${new Date().toISOString().split("T")[0]}T${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;

    const form = document.getElementById('kcal-form');
    form.onformdata = (e) => {
        const formData = {};
        e.formData.forEach((value, key) => {
            formData[key] = value;
        })
        console.log(formData)
    }

    const response = await fetch('/api/kcal?by=what');
    renderSuggestionList(await response.json());
    serviceWorkerOnMessageHandler(renderSuggestionList);
})();
