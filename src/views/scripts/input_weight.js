import {
	bootstrapApp, promptUser, getFormDataJson, errorAlert, infoAlert
} from './utils.js';

const updateDateTimeInput = () => {
	const now = new Date();
	const nowIso = now.toISOString();
	const normalizedNow = nowIso.substring(0, nowIso.lastIndexOf('T'));

	const datetimeInput = document.querySelector('input[type=date]');
	datetimeInput.value = normalizedNow;

};

const sendWeightInput = async (form, user) => {
	const response = await fetch(`/api/input_weight?user=${user}`, {
		method: 'POST',
		body: JSON.stringify(getFormDataJson(form)),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status == 404) {
		errorAlert('There is no connection to the server.');
	} else if (response.status === 500) {
		const data = await response.json();
		errorAlert(data.message);
	} else {
		form.reset();
		updateDateTimeInput();
		infoAlert('Data send successfully.');
	}
};

const formHandling = (user) => {
	const form = document.getElementById('weight-form');
	form.onsubmit = async (e) => {
		e.preventDefault();
		sendWeightInput(form, user);
	};
};

(() => {
	bootstrapApp();
	window.onload = () => {
		const user = promptUser();
		if (user) {
			updateDateTimeInput();
			formHandling(user);
		}
	};
})();