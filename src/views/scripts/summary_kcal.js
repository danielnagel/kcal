import {
	bootstrapApp, serviceWorkerOnMessageHandler, promptUser
} from "./utils.js";
import "./tabulator.min.js";

const renderTable = (data) => {
	//create Tabulator on DOM element with id "example-table"
	// eslint-disable-next-line
	var table = new Tabulator("#example-table", {
		data: data, //assign data to table
		groupBy: "date",
		layout: "fitColumns",
		columns: [ //Define Table Columns
			{
				title: "what",
				field: "what" 
			},
			{
				title: "date",
				field: "date",
				visible: false 
			},
			{
				title: "time",
				field: "time" 
			},
			{
				title: "kcal",
				field: "kcal" 
			},
			{
				title: "comment",
				field: "comment",
				formatter: "textarea",
				print: false 
			},
		],
	});

	//trigger an alert message when the row is clicked
	table.on("rowClick", function (e, row) {
		alert("Row " + row.getData().id + " Clicked!!!!");
	});

	document.getElementById("print-table").addEventListener("click", function () {
		table.print(true, true);
	});
}

(() => {
	bootstrapApp();
	window.onload = async () => {
		const user = promptUser();
		if(user) {
			const response = await fetch(`/api/kcal?user=${user}`);
			renderTable(await response.json());
			serviceWorkerOnMessageHandler(renderTable);
		}
	}
})();