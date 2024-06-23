import {bootstrapApp, promptUser, serviceWorkerOnMessageHandler} from "./utils.js";

const updateConfiguration = (data) => {
	if (data.dailyKcalTarget !== undefined) {
		const kcalTarget = document.getElementById("dailyKcalTarget")
		kcalTarget.value = data.dailyKcalTarget
	}
	if (data.weightTarget !== undefined) {
		const weightTarget = document.getElementById("weightTarget")
		weightTarget.value = data.weightTarget
	}
	if (data.color !== undefined) {
		const color = document.getElementById("color")
		color.value = data.color
	}
	if (data.kcalHistoryCount !== undefined) {
		const kcalHistoryCount = document.getElementById("kcalHistoryCount")
		kcalHistoryCount.value = data.kcalHistoryCount
	}
}

const updateColor = () => {
	const userColorInput = document.getElementById("color");
	const r = document.querySelector(':root');
	userColorInput.oninput = (e) => {
		r.style.setProperty('--accent', e.target.value);
		if (localStorage) localStorage.setItem("color", e.target.value);
	}
}

(() => {
	bootstrapApp();
	window.onload = async () => {
		const user = promptUser();
		if(user) {
			const response = await fetch(`/api/configuration?user=${user}`)
			updateConfiguration(await response.json())
			serviceWorkerOnMessageHandler(updateConfiguration)
		}
		updateColor();
	}
})()
