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
	const columns = ['what', 'date', 'time', 'kcal', 'comment'];
	
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

(() => {
	bootstrapApp();
	window.onload = async () => {
		document.getElementById('next-page-button').onclick = getDataAndRenderTable;
		user = promptUser(getDataAndRenderTable);
		if (user) {
			await getDataAndRenderTable(user);
			serviceWorkerOnMessageHandler(renderTable);
		}
	};
})();