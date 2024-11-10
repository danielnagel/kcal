import {
	bootstrapApp, getFormDataJson, updateColor, errorAlert, infoAlert, getSession
} from './utils.js';

const updateUserInput = (userName) => {
	const userInput = document.getElementById('user');
	userInput.value = userName;
};

const updateUserColor = async (user, authToken) => {
	const response = await fetch(`/api/configuration?user=${user}`, {
		headers: {
			'Authorization': authToken
		}
	});
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else if (data.color !== undefined) {
		updateColor(data.color);
	}
};

const handleUpdate = async (formData, user, authToken) => {
	const response = await fetch('/api/user/update', {
		method: 'POST',
		body: JSON.stringify({
			user,
			newUser: formData.user
		}), 
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
		localStorage.setItem('user', formData.user);
		infoAlert('Updated user successfully.');
	}
};

const handleCreation = async (formData, authToken) => {
	const response = await fetch('/api/user/new', {
		method: 'POST',
		body: JSON.stringify({
			user: formData.user
		}),
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
		localStorage.setItem('user', formData.user);
		updateUserColor(formData.user, authToken);
		infoAlert('Created user successfully.');
	}
};

const formHandling = (userName, authToken) => {
	const form = document.getElementById('user-configuration-form');
	form.onsubmit = async (e) => {
		e.preventDefault();

		const formData = getFormDataJson(form);

		switch (e.submitter.value) {
		case 'update':
			await handleUpdate(formData, userName, authToken);
			break;
		case 'new':
			await handleCreation(formData, authToken);
			break;
		case 'change':
			localStorage.setItem('user', formData.user);
			updateUserColor(formData.user, authToken);
			infoAlert(`Logged in as ${formData.user}.`);
			break;
		default:
			console.error(`Unknown user configuration request: ${e.submitter.value}`);
		}
		form.reset();
		updateUserInput(localStorage.getItem('user'));
	};
};

(() => {
	bootstrapApp();
	const {userName, authToken} = getSession();
	window.onload = async () => {
		if (userName, authToken) {
			formHandling(userName, authToken);
			updateUserInput(userName);
		}
	};
})();
