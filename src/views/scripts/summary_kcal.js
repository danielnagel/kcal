import {
	bootstrapApp, serviceWorkerOnMessageHandler, promptUser,
	infoAlert,
	errorAlert, confirmationDialog
} from './utils.js';

let loadedData =  {
};
let nextPage = 1;
let user = '';

const renderTable = (data) => {
	loadedData = {
		...loadedData,
		...data
	};
	if (data.length === 0) {
		document.getElementById('next-page-button').disabled = true;
	}
	const table = document.createElement('table');
	table.classList.add('kcal-summary-table');
	const columns = ['what', 'time', 'kcal', 'comment'];
	
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

	const body = Object.entries(loadedData).map((entry, index) => {
		const [key, value] = entry;

		const group = document.createElement('tbody');
		group.classList.add('kcal-summary-table-group');
		if (index !== 0) group.classList.add('hidden-rows');

		const groupRow = document.createElement('tr');
		groupRow.classList.add('kcal-summary-table-group-row');
		groupRow.onclick = groupHeaderRowOnClickHandler;
		const groupHeaderCell = document.createElement('td');
		groupHeaderCell.setAttribute('colspan', 4);
		groupHeaderCell.classList.add('kcal-summary-table-group-header-cell');
		const groupHeaderCellMainText = document.createElement('span');
		groupHeaderCellMainText.classList.add('kcal-summary-table-group-header-cell-main-text');
		groupHeaderCellMainText.innerText = key;
		const groupHeaderCellSubText = document.createElement('span');
		groupHeaderCellSubText.classList.add('kcal-summary-table-group-header-cell-sub-text');
		groupHeaderCell.append(groupHeaderCellMainText, groupHeaderCellSubText);
		groupRow.append(groupHeaderCell);
		group.append(groupRow);

		let kcalSummary = 0;
		group.append(...value.map(item => {
			const row = document.createElement('tr');
			row.classList.add('kcal-summary-table-row');
			
			const cells = columns.map(c => {
				const td = document.createElement('td');
				td.classList.add('kcal-summary-table-cell');
				td.classList.add(`kcal-summary-table-cell-${c}`);
				const value = item[c];
				if (c === 'kcal') {
					const numberValue = parseInt(value);
					if (!isNaN(numberValue)) {
						kcalSummary += numberValue;
					}
				}
				td.innerText = value;
				return td;
			});

			row.append(...cells);
			row.setAttribute('data-kcal', JSON.stringify(item));
			row.onclick = rowOnClickHandler;
			if (index !== 0) row.classList.add('hidden');
			return row;
		}));

		groupHeaderCellSubText.innerText = `(${value.length} ${value.length <= 1 ? 'item' : 'items'}, ${kcalSummary} kcal)`;

		return group;
	});


	table.append(...body);

	const tableContainer = document.getElementById('example-table');
	tableContainer.childNodes.forEach(c => c.remove());
	tableContainer.appendChild(table);
};

const getDataAndRenderTable = async (user) => {
	const response = await fetch(`/api/kcal?user=${user}&order=desc&page=${nextPage++}&group=date`);
	const data = await response.json();
	if (response.status === 500) {
		errorAlert(data.message);
	} else {
		renderTable(data);
	}
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
			deleteButton.onclick = async () => {
				if (!await confirmationDialog('Delete data?')) return;
				const response = await fetch(`/api/kcal?id=${jsonData.id}&user=${user}`, {
					method: 'delete'
				});
				if (response.status == 404) {
					errorAlert('There is no connection to the server.');
				} else if (response.status === 500) {
					const data = await response.json();
					errorAlert(data.message);
				} else {
					loadedData = [];
					nextPage = 1;
					getDataAndRenderTable();
					infoAlert('Deleted data successfully.');
				}
			};

			const udpateButton = dialog.querySelector('#kcal-detail-form-update-button');
			udpateButton.onclick = async () => {
				if (!await confirmationDialog('Update data?')) return;
				jsonData.what = whatInput.value;
				jsonData.kcal = kcalInput.value;
				jsonData.comment = commentInput.value;
				jsonData.date = datetimeInput.value;
				delete jsonData.time;

				const response = await fetch(`/api/kcal?user=${user}`, {
					method: 'put',
					body: JSON.stringify(jsonData),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (response.status == 404) {
					errorAlert('There is no connection to the server.');
				} else if (response.status === 500) {
					const data = await response.json();
					errorAlert(data.message);
				} else {
					loadedData = [];
					nextPage = 1;
					getDataAndRenderTable();
					infoAlert('Updated data successfully.');
				}
			};
			dialog.showModal();
		}
	}
};

const groupHeaderRowOnClickHandler = (event) => {
	if (!(event.target instanceof HTMLTableCellElement || event.target instanceof HTMLSpanElement)) return;
	let cellChild = null;
	if (event.target instanceof HTMLSpanElement) cellChild = event.target;
	const cell = cellChild ? cellChild.parentElement : event.target;
	const row = cell.parentElement;
	if (!(row instanceof HTMLTableRowElement)) return;
	const group = row.parentElement;
	if (!group) return;
	if (group.classList.contains('hidden-rows')) {
		group.classList.remove('hidden-rows');
		group.querySelectorAll('tr[data-kcal]').forEach(item => item.classList.remove('hidden'));
	} else {
		group.classList.add('hidden-rows');
		group.querySelectorAll('tr[data-kcal]').forEach(item => item.classList.add('hidden'));
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