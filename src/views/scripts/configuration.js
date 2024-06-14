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

;(async () => {
  const response = await fetch("/api/configuration")
  updateConfiguration(await response.json())
  serviceWorkerOnMessageHandler(updateConfiguration)
})()
