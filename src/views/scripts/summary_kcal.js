import {
	bootstrapApp, serviceWorkerOnMessageHandler, promptUser
} from './utils.js';
import './tabulator.min.js';

const today = new Date().toLocaleDateString('de-DE', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric' 
});

const renderTable = (data) => {
	//create Tabulator on DOM element with id "example-table"
	// eslint-disable-next-line
	var table = new Tabulator("#example-table", {
		data: data, //assign data to table
		groupBy: 'date',
		groupStartOpen: (value) => {
			return value === today;
		},
		layout: 'fitColumns',
		columns: [ //Define Table Columns
			{
				title: 'what',
				field: 'what' 
			},
			{
				title: 'date',
				field: 'date',
				visible: false 
			},
			{
				title: 'time',
				field: 'time' 
			},
			{
				title: 'kcal',
				field: 'kcal' 
			},
			{
				title: 'comment',
				field: 'comment',
				formatter: 'textarea',
				print: false 
			},
		],
	});

	//trigger an alert message when the row is clicked
	table.on('rowClick', function (e, row) {
		alert('Row ' + row.getData().id + ' Clicked!!!!');
	});

	document.getElementById('print-table').addEventListener('click', function () {
		table.print(true, true);
	});
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