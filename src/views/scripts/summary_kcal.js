import {
	bootstrapApp, serviceWorkerOnMessageHandler, promptUser
} from './utils.js';

let loadedData = [];
let nextPage = 1;
let user = '';

const renderTable = (data) => {
	loadedData = [...loadedData, ...data];
	if (data.length < 25) {
		document.getElementById('next-page-button').disabled = true;
	}
	const table = document.createElement('table');
	table.classList.add('kcal-summary-table');
	const columns = ['what', 'date', 'time', 'kcal'];
	if (window.innerWidth > 600) {
		columns.push('comment');
	}
	
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

	const body = loadedData.map(d => {
		const row = document.createElement('tr');
		row.classList.add('kcal-summary-table-row');
		
		const cells = columns.map(c => {
			const td = document.createElement('td');
			td.classList.add('kcal-summary-table-cell');
			td.classList.add(`kcal-summary-table-cell-${c}`);
			td.innerText = d[c];
			return td;
		});

		row.append(...cells);
		row.setAttribute('data-kcal', JSON.stringify(d));
		row.onclick = rowOnClickHandler;
		return row;
	});
	table.append(...body);

	const tableContainer = document.getElementById('example-table');
	tableContainer.childNodes.forEach(c => c.remove());
	tableContainer.appendChild(table);
};

const getDataAndRenderTable = async () => {
	const response = await fetch(`/api/kcal?user=${user}&order=desc&page=${nextPage++}`);
	renderTable(await response.json());
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
			const dialog = document.querySelector('#kcal-detail-modal');
			const datetimeInput = dialog.querySelector('#date');
			const parts = jsonData.date.split('.');
			if (parts.length === 3) {
				datetimeInput.value = `${parts[2]}-${parts[1]}-${parts[0]}T${jsonData.time}`;
			}
			const whatInput = dialog.querySelector('#what');
			whatInput.value = jsonData.what;
			const kcalInput = dialog.querySelector('#kcal');
			kcalInput.value = jsonData.kcal;
			const commentInput = dialog.querySelector('#comment');
			commentInput.value = jsonData.comment;
			const deleteButton = dialog.querySelector('#kcal-detail-form-delete-button');
			deleteButton.onclick = () => {
				fetch(`/api/kcal?id=${jsonData.id}&user=${user}`, {
					method: 'delete'
				});
			};
			dialog.showModal();
		}
	}
};

(() => {
	bootstrapApp();
	window.onload = async () => {
		document.getElementById('next-page-button').onclick = getDataAndRenderTable;
		document.querySelector('#kcal-detail-form-cancel-button').onclick = () => {
			document.querySelector('#kcal-detail-modal').close();
		};
		user = promptUser(getDataAndRenderTable);
		if (user) {
			await getDataAndRenderTable(user);
			serviceWorkerOnMessageHandler(renderTable);
		}
	};
})();