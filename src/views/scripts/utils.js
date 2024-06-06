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