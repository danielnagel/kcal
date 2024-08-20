import {
	bootstrapApp, promptUser, serviceWorkerOnMessageHandler, copyToClipboard, getFormDataJson,
	infoAlert,
	errorAlert
} from './utils.js';

const storageItemKey = 'unsendFormData';

const updateDateTimeInput = () => {
	const datetimeInput = document.querySelector('input[type=datetime-local]');
	datetimeInput.value = `${new Date().toISOString().split('T')[0]}T${new Date().toLocaleTimeString('de-DE', {
		hour: '2-digit',
		minute: '2-digit' 
	})}`;
};

const renderSuggestionList = (data) => {
	// build suggestion list
	const what = data.map(item => item.what);
	const detaillist = document.getElementById('suggestion-list');
	what.forEach(item => {
		const option = document.createElement('option');
		option.setAttribute('value', item);
		detaillist.appendChild(option);
	});

	// paste kcal to from selected suggestion into kcal field
	const whatInput = document.getElementById('what');
	const kcalInput = document.getElementById('kcal');
	whatInput.addEventListener('input', () => {
		if (what.includes(whatInput.value)) {
			const filteredData = data.filter(item => item.what === whatInput.value);
			if (filteredData.length > 0) {
				kcalInput.value = filteredData[0].kcal;
			}
		}
	});
};

const getParsedStoredData = () => {
	const result = [];
	if (!localStorage) return [];
	const storedData = localStorage.getItem(storageItemKey);
	if (storedData) {
		try {
			result.push(...JSON.parse(storedData));
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			console.error(`could not parse data from store. stored data: ${storedData}`);
		}
	}
	return result;
};

const sendDataList = async (dataList, user) => {
	const response = await fetch(`/api/input_kcal?user=${user}`, {
		method: 'POST',
		body: JSON.stringify(dataList),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (response.status == 404) {
		if (localStorage) localStorage.setItem(storageItemKey, JSON.stringify(dataList));
		errorAlert('There is no connection to the server.');
		renderOfflineInfo(user);
	} else if (response.status === 500) {
		const data = await response.json();
		errorAlert(data.message);
	} else {
		if (localStorage)
			localStorage.removeItem(storageItemKey);
		const form = document.getElementById('kcal-form');
		form.reset();
		updateDateTimeInput();
		infoAlert('Data send successfully.');
	}
};

const formHandling = (user) => {
	const form = document.getElementById('kcal-form');
	form.onsubmit = async (e) => {
		e.preventDefault();
		sendDataList([...getParsedStoredData(), getFormDataJson(form)], user);
	};
};

const showOfflineContainer = () => {
	const offlineContainer = document.getElementById('offline-container');
	if (offlineContainer.classList.contains('hidden')) offlineContainer.classList.remove('hidden');
};

const hideOfflineContainer = () => {
	const offlineContainer = document.getElementById('offline-container');
	if (!offlineContainer.classList.contains('hidden')) offlineContainer.classList.add('hidden');
};

const renderOfflineInfo = (user) => {
	if (localStorage) {
		const storedData = localStorage.getItem(storageItemKey);
		if (storedData) {
			const data = [];
			try {
				data.push(...JSON.parse(storedData));
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (e) {
				console.error(`could not parse data from store. stored data: ${storedData}`);
			}
			const offlineMessage = document.getElementById('offline-message');
			const copyButton = document.getElementById('offline-copy-button');
			const sendButton = document.getElementById('offline-resend-button');
			offlineMessage.innerText = `Data could not be send, ${data.length} stored items.`;
			copyButton.onclick = () => copyToClipboard(storedData);
			sendButton.onclick = async () => {
				await sendDataList(getParsedStoredData(), user);
				if (localStorage && !localStorage.getItem(storageItemKey)) hideOfflineContainer();
			};
			showOfflineContainer();
			return;
		}
	}
	hideOfflineContainer();
};

const getAndRenderSuggestionList = async (user) => {
	const response = await fetch(`/api/kcal?select=what&user=${user}`);
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else {
		renderSuggestionList(data);
	}
};

(() => {
	bootstrapApp();
	window.onload = async () => {
		updateDateTimeInput();
		const user = promptUser(getAndRenderSuggestionList);
		if (user) {
			await getAndRenderSuggestionList(user);
			formHandling(user);
			renderOfflineInfo(user);
			serviceWorkerOnMessageHandler(renderSuggestionList);
		}
	};
})();
