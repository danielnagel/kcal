const now = new Date();
const nowIso = now.toISOString();
const normalizedNow = nowIso.substring(0, nowIso.lastIndexOf(":"));

const datetimeInput = document.querySelector("input[type=datetime-local]");
datetimeInput.value = normalizedNow;