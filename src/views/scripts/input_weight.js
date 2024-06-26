import {
	bootstrapApp, promptUser, getFormDataJson
} from "./utils.js";

const updateDateTimeInput = () => {
	const now = new Date();
	const nowIso = now.toISOString();
	const normalizedNow = nowIso.substring(0, nowIso.lastIndexOf("T"));

	const datetimeInput = document.querySelector("input[type=date]");
	datetimeInput.value = normalizedNow;

}

const sendWeightInput = async (form, user) => {
	return fetch(`/api/input_weight?user=${user}`, {
		method: "POST",
		body: JSON.stringify(getFormDataJson(form)),
		headers: {
			"Content-Type": "application/json",
		},
	})
}

const formHandling = (user) => {
	const form = document.getElementById('weight-form');
	form.onsubmit = async (e) => {
		e.preventDefault();
		await sendWeightInput(form, user);
		form.reset();
		updateDateTimeInput();
	};
};

(() => {
	bootstrapApp();
	window.onload = () => {
		const user = promptUser();
		if(user) {
			updateDateTimeInput();
			formHandling(user);
		}
	};
})();