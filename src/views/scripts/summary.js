const loadAllKcalData = async () => {
    const response = await fetch('/kcal');
    return response.json()
}

const main = async () => {

    const data = await loadAllKcalData();

    //create Tabulator on DOM element with id "example-table"
    var table = new Tabulator("#example-table", {
        height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data:data, //assign data to table
        columns:[ //Define Table Columns
            {title:"what", field:"what", width: 80},
            {title:"time", field:"time", width: 140},
            {title:"kcal", field:"kcal", width: 50},
            {title:"comment", field:"comment", width: 80},
        ],
    });

    //trigger an alert message when the row is clicked
    table.on("rowClick", function(e, row){ 
        alert("Row " + row.getData().id + " Clicked!!!!");
    });
}

main();