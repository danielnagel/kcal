import {
	bootstrapApp, serviceWorkerOnMessageHandler, promptUser, errorAlert
} from './utils.js';
import './chart.umd.js';

let chartInstance = undefined;

const renderChart = (data) => {
	if (!Array.isArray(data)) return;
	if (chartInstance) chartInstance.destroy();
    
	const date = data.map(item => item.date);
	const weight = data.map(item => item.weight);
	const waist = data.map(item => item.waist);

	// eslint-disable-next-line
	chartInstance = new Chart(
		document.getElementById('summary-weight'),
		{
			type: 'line',
			data: {
				labels: date,
				datasets: [
					{
						label: 'weight',
						data: weight
					},
					{
						label: 'waist',
						data: waist
					}
				]
			},
			options: {
				responsive: true,
				interaction: {
					mode: 'index',
					intersect: false,
				},
			},
		});
};

const renderWeightTarget = async (data) => {
	const container = document.getElementById('target-summary-container');
	const text = document.createElement('p');
	text.innerHTML = `Target is <strong>${data.weightTarget}kg</strong>.`;
	const text2 = document.createElement('p');
	text2.innerHTML = `When losing <strong>two kilos per Month</strong>, the goal is reached in <strong>${data.twoKiloPrediction}</strong>.`;
	const text3 = document.createElement('p');
	text3.innerHTML = `When losing <strong>one kilo per Month</strong>, the goal is reached in <strong>${data.oneKiloPrediction}</strong>.`;
	container.appendChild(text);
	container.appendChild(text2);
	container.appendChild(text3);
};

const renderTable = (data) => {
	const table = document.createElement('table');
	table.classList.add('kcal-summary-table');
	const columns = ['date', 'weight', 'waist'];
	
	const headers = columns.map(c => {
		const th = document.createElement('th');
		th.classList.add('kcal-summary-table-cell');
		th.classList.add('kcal-summary-table-cell-head');
		th.innerText = c;
		return th;
	});
	const header = document.createElement('tr');
	header.classList.add('kcal-summary-table-row');
	header.append(...headers);
	table.appendChild(header);

	const body = data.map(item => {
		const row = document.createElement('tr');
		row.classList.add('kcal-summary-table-row');
		
		const cells = columns.map(c => {
			const td = document.createElement('td');
			td.classList.add('kcal-summary-table-cell');
			td.classList.add(`kcal-summary-table-cell-${c}`);
			td.innerText = item[c];
			return td;
		});

		row.append(...cells);
		row.setAttribute('data-kcal', JSON.stringify(item));
		return row;
	});

	table.append(...body);

	const tableContainer = document.getElementById('weight-table');
	tableContainer.childNodes.forEach(c => c.remove());
	tableContainer.appendChild(table);
};


const getDataAndRender = async (user) => {
	const response = await fetch(`/api/weight?user=${user}`);
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else {
		renderChart(data);
		renderTable(data);
	}
	const targetResponse = await fetch(`/api/weight?summary=true&user=${user}`);
	const targetData = await targetResponse.json();
	if (targetResponse.status === 500) {
		errorAlert(targetData.message);
	} else {
		renderWeightTarget(targetData);
	}
};

(() => {
	bootstrapApp();
	window.onload = async () => {
		const user = promptUser(getDataAndRender);
		if (user) {
			await getDataAndRender(user);
			serviceWorkerOnMessageHandler(renderChart);
		}
	};
})();
