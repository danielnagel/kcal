import {
	bootstrapApp, promptUser, serviceWorkerOnMessageHandler, getFormDataJson, updateColor,
	errorAlert,
	infoAlert
} from './utils.js';

const updateConfiguration = (data) => {
	if (data.dailyKcalTarget !== undefined) {
		const kcalTarget = document.getElementById('dailyKcalTarget');
		kcalTarget.value = data.dailyKcalTarget;
	}
	if (data.weightTarget !== undefined) {
		const weightTarget = document.getElementById('weightTarget');
		weightTarget.value = data.weightTarget;
	}
	if (data.color !== undefined) {
		const color = document.getElementById('color');
		color.value = data.color;
		updateColor(data.color);
	}
	if (data.kcalHistoryCount !== undefined) {
		const kcalHistoryCount = document.getElementById('kcalHistoryCount');
		kcalHistoryCount.value = data.kcalHistoryCount;
	}
};

const updateColorFromInput = () => {
	const userColorInput = document.getElementById('color');
	userColorInput.oninput = (e) => {
		updateColor(e.target.value);
	};
};

const sendConfiguration = async (form, user) => {
	const response = await fetch(`/api/configuration?user=${user}`, {
		method: 'POST',
		body: JSON.stringify(getFormDataJson(form)),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (response.status === 500) {
		const data = await response.json();
		errorAlert(data.message);
	} else {
		infoAlert('Configuration updated successfully.');
	}
};

const formHandling = (user) => {
	const form = document.getElementById('configuration-form');
	form.onsubmit = async (e) => {
		e.preventDefault();
		await sendConfiguration(form, user);
	};
};

const getAndUpdateConfiguration = async (user) => {
	const response = await fetch(`/api/configuration?user=${user}`);
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else {
		updateConfiguration(data);
	}
};

(() => {
	bootstrapApp();
	window.onload = async () => {
		const user = promptUser(getAndUpdateConfiguration);
		if (user) {
			await getAndUpdateConfiguration(user);
			formHandling(user);
			serviceWorkerOnMessageHandler(updateConfiguration);
		}
		updateColorFromInput();
	};
})();
