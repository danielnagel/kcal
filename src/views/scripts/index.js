import {
	bootstrapApp, promptUser, serviceWorkerOnMessageHandler
} from './utils.js';

const renderProgressBar = (is, goal) => {
	const progressBar = document.createElement('div');
	progressBar.classList.add('progress-bar');
	progressBar.style.width = calculateProgress(is, goal) + '%';
	const container = document.createElement('div');
	container.classList.add('progress-container');
	container.appendChild(progressBar);
	return container;
};

const calculateProgress = (is, goal) => {
	return Math.round(is / goal * 100);
};

const renderProgressInfoContainer = (labelText, is, goal) => {
	const container = document.createElement('div');
	container.classList.add('progress-info-container');
	const label = document.createElement('p');
	label.style.margin = 0;
	label.innerText = `${labelText} calories: ${is} of ${goal}`;
	container.appendChild(label);
	container.appendChild(renderProgressBar(is, goal));
	document.getElementById('daily-info-container').appendChild(container);
};

const removeProgressInfoContainer = () => {
	document.querySelectorAll('.progress-info-container').forEach(e => e.remove());
	document.querySelectorAll('.calories-summary-info').forEach(e => e.remove());
};

const calculateColor = (difference) => {
	if (difference >= 1500 || difference <= -1500) return 'red';
	if (difference >= 1000 || difference <= -1000) return 'orangered';
	if (difference >= 500 || difference <= -500) return 'orange';
	return 'var(--secondary)';
};

const renderKcalHistorySummary = (actual, expected, difference, days, target) => {
	const text = document.createElement('p');
	text.classList.add('calories-summary-info');
	text.innerHTML = `last <strong>${days} days</strong> difference is <strong style="color: ${calculateColor(difference)}">${difference} kcal</strong>`;
	text.title = `Considering daily target of ${target} kcal, overall kcal consumption should be ${expected} kcal and is ${actual} kcal.`;
	document.getElementById('daily-info-container').appendChild(text);
};

const renderDailyCalories = (data) => {
	removeProgressInfoContainer();
	if (typeof data.lastMealTime !== 'undefined' && typeof data.lastMealAgo !== 'undefined') {
		document.getElementById('today-last-meal').innerText = `last meal: ${data.lastMealTime} (${data.lastMealAgo}h ago)`;
	}

	if (typeof data.todayKcal !== 'undefined' && typeof data.dailyKcalTarget !== 'undefined') {
		renderProgressInfoContainer('today', data.todayKcal, data.dailyKcalTarget);
	}

    
	if (Array.isArray(data.pastDailyKcal) && typeof data.dailyKcalTarget !== 'undefined') {
		if (data.actualKcalHistorySum !== undefined && data.expectedKcalHistorySum !== undefined && data.kcalHistorySumDifference !== undefined) {
			renderKcalHistorySummary(data.actualKcalHistorySum, data.expectedKcalHistorySum, data.kcalHistorySumDifference, data.pastDailyKcal.length, data.dailyKcalTarget);
		}
		data.pastDailyKcal.forEach(d => {
			if (typeof d.date !== 'undefined' && typeof d.kcal !== 'undefined') {
				renderProgressInfoContainer(d.date, d.kcal, data.dailyKcalTarget);
			}
		});
	}
};

const getAndRenderTodayCalories = async (user) => {
	const response = await fetch(`/api/kcal?for=today&user=${user}`);
	renderDailyCalories(await response.json());
};

(() => {
	bootstrapApp();
	window.onload = async () => {
		const user = promptUser(getAndRenderTodayCalories);
		if (user) {
			await getAndRenderTodayCalories(user);
			serviceWorkerOnMessageHandler(renderDailyCalories);
		}
	};
})();