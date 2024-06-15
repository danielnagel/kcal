const storageItemKey = "unsendFormData"

const updateConfiguration = (data) => {
  if (data.dailyKcalTarget !== undefined) {
    const kcalTarget = document.getElementById("dailyKcalTarget")
    kcalTarget.value = data.dailyKcalTarget
  }
  if (data.weightTarget !== undefined) {
    const weightTarget = document.getElementById("weightTarget")
    weightTarget.value = data.weightTarget
  }
}

// TODO: store on server
// TODO: put color into local storage
// TODO: load initial on every page, if set, set the color

;(async () => {
  const response = await fetch("/api/configuration")
  updateConfiguration(await response.json())
  serviceWorkerOnMessageHandler(updateConfiguration)

  const userColorInput = document.getElementById("userColor");
  const r = document.querySelector(':root');
  userColorInput.oninput = (e) => {
    r.style.setProperty('--accent', e.target.value);
  }
})()
