import {
	bootstrapApp,
	getFormDataJson,
	getSession,
	errorAlert,
	infoAlert
} from './utils.js';

const updateDateTimeInput = () => {
	const now = new Date();
	const nowIso = now.toISOString();
	const normalizedNow = nowIso.substring(0, nowIso.lastIndexOf('T'));

	const datetimeInput = document.querySelector('input[type=date]');
	datetimeInput.value = normalizedNow;

};

const sendWeightInput = async (form, userName, authToken) => {
	const response = await fetch(`/api/input_weight?user=${userName}`, {
		method: 'POST',
		body: JSON.stringify(getFormDataJson(form)),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': authToken
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

const formHandling = (userName, authToken) => {
	const form = document.getElementById('weight-form');
	form.onsubmit = async (e) => {
		e.preventDefault();
		sendWeightInput(form, userName, authToken);
	};
};

(() => {
	bootstrapApp();
	const {userName, authToken} = getSession();
	window.onload = async () => {
		if (userName && authToken) {
			updateDateTimeInput();
			formHandling(userName, authToken);
		}
	};
})();