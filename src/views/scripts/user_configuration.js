import {
	bootstrapApp, promptUser, getFormDataJson
} from "./utils.js";

const updateUserInput = (user) => {
	const userInput = document.getElementById("user");
	userInput.value = user;
};

const formHandling = () => {
	const form = document.getElementById("user-configuration-form");
	form.onsubmit = async (e) => {
		e.preventDefault();
		let user = null;
		if(localStorage) user = localStorage.getItem("user");
		if(!user) return;

		const formData = getFormDataJson(form);

		switch(e.submitter.value) {
		case "update":
			await fetch(`/api/user/update`, {
				method: "POST",
				body: JSON.stringify({
					user,
					newUser: formData.user
				}), 
				headers: {
					"Content-Type": "application/json",
				},
			});
			localStorage.setItem("user", formData.user);
			break;
		case "new":
			await fetch(`/api/user/new`, {
				method: "POST",
				body: JSON.stringify({
					user: formData.user
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			localStorage.setItem("user", formData.user);
			break;
		case "change":
			localStorage.setItem("user", formData.user);
			break;
		default:
			console.error(`Unknown user configuration request: ${e.submitter.value}`);
		}
		form.reset();
		updateUserInput(localStorage.getItem("user"));
	};
};

(() => {
	bootstrapApp();
	
	window.onload = async () => {
		const user = promptUser();
		if(user) {
			formHandling();
			updateUserInput(user);
		}
	};
})();
