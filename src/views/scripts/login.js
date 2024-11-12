import {
	getFormDataJson 
} from './utils.js';

(() => {
	window.onload = () => {
		const form = document.getElementById('login-form');
		form.onsubmit = async (e) => {
			e.preventDefault();
			const data = getFormDataJson(form);
			const credentials = btoa(`${data.username}:${data.password}`);
			const authToken = `Basic ${credentials}`;
			sessionStorage.setItem('userName', data.username);
			sessionStorage.setItem('authToken', authToken);
			if(navigator.serviceWorker) {
				navigator.serviceWorker.controller.postMessage({type: 'AUTHORIZATION', payload: authToken});
			}
			window.open('/', '_self');
		};
	};
})();