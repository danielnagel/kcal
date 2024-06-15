const serviceWorkerOnMessageHandler = (callback) => {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.onmessage = event => {
            const message = JSON.parse(event.data);
            if (message && message.type.includes("/api/")) {
                callback(message.data);
            }
        }
    }
}

const unsecuredCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
}

const copyToClipboard = (text) => {
    if (navigator.clipboard) {
        // If normal copy method available, use it
        navigator.clipboard.writeText(text);
      } else {
        // Otherwise fallback to the above function, e.g. iOS using http
        // https://stackoverflow.com/a/72239825
        unsecuredCopyToClipboard(text);
      }
}

const installServiceWorker = () => {
    if (navigator.serviceWorker) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/serviceworker.js');
        })
    }
}

const persistData = async () => {
    if (navigator.storage && navigator.storage.persist) {
        await navigator.storage.persist();
    }
}

const setColorFromStorage = () => {
    if (localStorage) {
        const color = localStorage.getItem("color");
        const r = document.querySelector(':root');
        r.style.setProperty('--accent', color);
    }
}

const bootstrapApp = () => {
    installServiceWorker();
    persistData();
    setColorFromStorage();
}