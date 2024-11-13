const installServiceWorker = () => {
	if (navigator.serviceWorker) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/serviceworker.js');
		});
	}
};

const persistData = async () => {
	if (navigator.storage && navigator.storage.persist) {
		await navigator.storage.persist();
	}
};

const setColorFromStorage = () => {
	if (localStorage) {
		const color = localStorage.getItem('color');
		const r = document.querySelector(':root');
		r.style.setProperty('--accent', color);
	}
};

export const bootstrapApp = () => {
	installServiceWorker();
	persistData();
	setColorFromStorage();
};

export const getFormDataJson = (form) => {
	const formData = new FormData(form);
	const data = {
	};
	formData.forEach((value, key) => {
		data[key] = value;
	});
	return data;
};

export const updateColor = (color) => {
	const r = document.querySelector(':root');
	r.style.setProperty('--accent', color);
	if (localStorage) localStorage.setItem('color', color);
};

const alert = (header, message, error) => {
	const alertContainer = document.createElement('div');
	alertContainer.classList.add('alert');
	if (error) alertContainer.classList.add('error-alert');
	const removeAlertContainer = () => {
		alertContainer.classList.add('hide-opacity');
		setTimeout(() => alertContainer.remove(), 1000);
	};
	alertContainer.onclick = removeAlertContainer;
	const headerElement = document.createElement('strong');
	headerElement.innerText = header;

	const messageElement = document.createElement('p');
	messageElement.innerText = message;

	alertContainer.appendChild(headerElement);
	alertContainer.appendChild(messageElement);
	document.body.appendChild(alertContainer);
	setTimeout(() => {
		removeAlertContainer();
	}, 5000);
};

export const infoAlert = (message) => {
	alert('Info', message);
};

export const errorAlert = (message) => {
	alert('Error', message, true);
};

export const confirmationDialog = async (message) => {
	return new Promise(resolve => {
		const dialog = document.createElement('dialog');
		dialog.classList.add('confirmation-dialog');
		const messageContainer = document.createElement('p');
		messageContainer.innerText = message;
		const confirmButton = document.createElement('button');
		confirmButton.innerText = 'ok';
		confirmButton.classList.add('form-submit');
		const cancelButton = document.createElement('button');
		cancelButton.innerText = 'cancel';
		cancelButton.classList.add('form-submit');
		dialog.appendChild(messageContainer);
		dialog.appendChild(confirmButton);
		dialog.appendChild(cancelButton);
		document.body.appendChild(dialog);
		dialog.showModal();
		confirmButton.onclick = () => {
			dialog.close();
			resolve(true);
		};
		cancelButton.onclick = () => {
			dialog.close();
			resolve(false);
		};
	});
};

export const getSession = () => {
	if (!sessionStorage) throw new Error('Site does not work without Session storage!');
	const userName = sessionStorage.getItem('userName');
	const authToken = sessionStorage.getItem('authToken');

	if (!userName || !authToken) {
		window.open('/login', '_self');
	}
	
	return {
		userName,
		authToken 
	};
};
