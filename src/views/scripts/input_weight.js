(() => {
    const now = new Date();
    const nowIso = now.toISOString();
    const normalizedNow = nowIso.substring(0, nowIso.lastIndexOf("T"));

    const datetimeInput = document.querySelector("input[type=date]");
    datetimeInput.value = normalizedNow;
})();