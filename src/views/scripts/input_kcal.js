const storageItemKey = "unsendFormData";

const updateDateTimeInput = () => {
    const datetimeInput = document.querySelector("input[type=datetime-local]");
    datetimeInput.value = `${new Date().toISOString().split("T")[0]}T${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
}

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

const formHandling = () => {
    const form = document.getElementById('kcal-form');
    form.onsubmit = async (e) => {
        if (!localStorage) return;
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        const dataList = [data];
        const storedData = localStorage.getItem(storageItemKey);
        if (storedData) {
            try {
                dataList.push(...JSON.parse(storedData));
            } catch (e) {
                console.error(`could not parse data from store. stored data: ${storedData}`);
            }
        }
        try {
            const response = await fetch("/api/input_kcal", {
                method: "POST",
                body: JSON.stringify(dataList),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.status == 200)
                localStorage.removeItem(storageItemKey);
        } catch (e) {
            localStorage.setItem(storageItemKey, JSON.stringify(dataList));
        }
        form.reset();
        updateDateTimeInput();
        renderOfflineInfo();
    }
}

const renderOfflineInfo = () => {
    const offlineMessage = document.getElementById("offline-message");
    if (localStorage) {
        const storedData = localStorage.getItem(storageItemKey);
        if (storedData) {
            const data = [];
            try {
                data.push(...JSON.parse(storedData));
            } catch (e) {
                console.error(`could not parse data from store. stored data: ${storedData}`);
            }
            offlineMessage.innerText = `You are offline, ${data.length} form data items stored.`;
            offlineMessage.onclick = () => navigator.clipboard.writeText(storedData);
            return;
        }
    }
    offlineMessage.innerText = '';
    offlineMessage.onclick = null;
}

(async () => {
    updateDateTimeInput()

    formHandling();
    renderOfflineInfo();

    const response = await fetch('/api/kcal?by=what');
    renderSuggestionList(await response.json());
    serviceWorkerOnMessageHandler(renderSuggestionList);
})();
