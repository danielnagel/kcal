import {
	bootstrapApp, serviceWorkerOnMessageHandler, promptUser
} from './utils.js';

const renderTable = (data) => {
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

	const body = data.map(d => {
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

	document.getElementById('example-table').appendChild(table);
};

const getDataAndRenderTable = async (user) => {
	const response = await fetch(`/api/kcal?user=${user}&order=desc`);
	renderTable(await response.json());
};

(() => {
	bootstrapApp();
	window.onload = async () => {
		const user = promptUser(getDataAndRenderTable);
		if (user) {
			await getDataAndRenderTable(user);
			serviceWorkerOnMessageHandler(renderTable);
		}
	};
})();