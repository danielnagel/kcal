import {
	getFormDataJson 
} from './utils.js';

(() => {
	window.onload = () => {
		const form = document.getElementById('login-form');
		form.onsubmit = async (e) => {
			e.preventDefault();
			const data = getFormDataJson(form);
			console.log(data);
			const credentials = btoa(`${data.username}:${data.password}`);
			sessionStorage.setItem('userName', data.username);
			sessionStorage.setItem('authToken', `Basic ${credentials}`);
			window.open('/', '_self');
		};
	};
})();