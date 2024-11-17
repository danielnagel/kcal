import {
	bootstrapApp,
	errorAlert,
	confirmationDialog,
	infoAlert,
	getSession
} from './utils.js';
import './chart.umd.js';

let chartInstance = undefined;
let user = '';
let auth = '';

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
	container.innerHTML = '';
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

	const body = data.toReversed().map(item => {
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
		row.onclick = rowOnClickHandler;
		return row;
	});

	table.append(...body);

	const tableContainer = document.getElementById('weight-table');
	tableContainer.childNodes.forEach(c => c.remove());
	tableContainer.appendChild(table);
};


const rowOnClickHandler = (event) =>  {
	if (event.target instanceof HTMLTableCellElement) {
		const cell = event.target;
		const row = cell.parentElement;
		if (row instanceof HTMLTableRowElement) {
			const data = row.getAttribute('data-kcal');
			let jsonData = null;
			try {
				jsonData = JSON.parse(data);
			} catch (e) {
				console.error(`Could not parse row data, reason: ${e.message}`);
			}
			const dialog = document.querySelector('#weight-detail-modal');

			document.querySelector('#weight-detail-form-cancel-button').onclick = () => {
				dialog.close();
			};
			const dateInput = dialog.querySelector('#date');
			const parts = jsonData.date.split('.');
			if (parts.length === 3) {
				dateInput.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
			}
			const weightInput = dialog.querySelector('#weight');
			weightInput.value = jsonData.weight;
			const waistInput = dialog.querySelector('#waist');
			waistInput.value = jsonData.waist;

			const deleteButton = dialog.querySelector('#weight-detail-form-delete-button');
			deleteButton.onclick = async () => {
				if (!await confirmationDialog('Delete data?')) return;
				const response = await fetch(`/api/weight?id=${jsonData.id}&user=${user}`, {
					method: 'delete',
					headers: {
						'Authorization': auth
					}
				});
				if (response.status == 404) {
					errorAlert('There is no connection to the server.');
				} else if (response.status === 500) {
					const data = await response.json();
					errorAlert(data.message);
				} else {
					getDataAndRender(user, auth);
					infoAlert('Deleted data successfully.');
				}
			};

			const udpateButton = dialog.querySelector('#weight-detail-form-update-button');
			udpateButton.onclick = async () => {
				if (!await confirmationDialog('Update data?')) return;
				jsonData.weight = weightInput.value;
				jsonData.waist = waistInput.value;
				jsonData.date = dateInput.value;

				const response = await fetch(`/api/weight?user=${user}`, {
					method: 'put',
					body: JSON.stringify(jsonData),
					headers: {
						'Content-Type': 'application/json',
						'Authorization': auth
					},
				});
				if (response.status == 404) {
					errorAlert('There is no connection to the server.');
				} else if (response.status === 500) {
					const data = await response.json();
					errorAlert(data.message);
				} else {
					getDataAndRender(user, auth);
					infoAlert('Updated data successfully.');
				}
			};
			dialog.showModal();
		}
	}
};

const getDataAndRender = async (userName, authToken) => {
	const response = await fetch(`/api/weight?user=${userName}`, {
		headers: {
			'Authorization': authToken
		}
	});
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else {
		renderChart(data);
		renderTable(data);
	}
	const targetResponse = await fetch(`/api/weight?summary=true&user=${userName}`, {
		headers: {
			'Authorization': authToken
		}
	});
	const targetData = await targetResponse.json();
	if (targetResponse.status === 500) {
		errorAlert(targetData.message);
	} else {
		renderWeightTarget(targetData);
	}
};

(() => {
	bootstrapApp();
	const {userName, authToken} = getSession();
	window.onload = async () => {
		if (userName && authToken) {
			user = userName;
			auth = authToken;
			await getDataAndRender(userName, authToken);
		}
	};
})();
