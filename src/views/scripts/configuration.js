import {
	bootstrapApp,
	getFormDataJson,
	getSession,
	updateColor,
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

const sendConfiguration = async (form, userName, authToken) => {
	const response = await fetch(`/api/configuration?user=${userName}`, {
		method: 'POST',
		body: JSON.stringify(getFormDataJson(form)),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': authToken
		},
	});
	if (response.status === 500) {
		const data = await response.json();
		errorAlert(data.message);
	} else {
		infoAlert('Configuration updated successfully.');
	}
};

const formHandling = (userName, authToken) => {
	const form = document.getElementById('configuration-form');
	form.onsubmit = async (e) => {
		e.preventDefault();
		await sendConfiguration(form, userName, authToken);
	};
};

const getAndUpdateConfiguration = async (userName, authToken) => {
	const response = await fetch(`/api/configuration?user=${userName}`, {
		headers: {
			'Authorization': authToken
		}
	});
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else {
		updateConfiguration(data);
	}
};

const logoutClickHandler = () => {
	const logoutButton = document.getElementById('logout-button');
	logoutButton.onclick = () => {
		if (sessionStorage) {
			sessionStorage.removeItem('userName');
			sessionStorage.removeItem('authToken');
			window.open('/login', '_self');
		}
	};
};

(() => {
	bootstrapApp();
	const {userName, authToken} = getSession();
	window.onload = async () => {
		if (userName && authToken) {
			await getAndUpdateConfiguration(userName, authToken);
			formHandling(userName, authToken);
		}
		logoutClickHandler();
		updateColorFromInput();
	};
})();
