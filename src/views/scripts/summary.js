const loadAllKcalData = async () => {
    const response = await fetch('/kcal');
    return response.json()
}

const main = async () => {

    const data = await loadAllKcalData();

    //create Tabulator on DOM element with id "example-table"
    var table = new Tabulator("#example-table", {
        data: data, //assign data to table
        groupBy: "date",
        columns:[ //Define Table Columns
            {title:"what", field:"what", formatter: "textarea"},
            {title:"date", field:"date", visible: false},
            {title:"time", field:"time"},
            {title:"kcal", field:"kcal"},
            {title:"comment", field:"comment", formatter: "textarea", print: false},
        ],
    });

    //trigger an alert message when the row is clicked
    table.on("rowClick", function(e, row){ 
        alert("Row " + row.getData().id + " Clicked!!!!");
    });

    document.getElementById("print-table").addEventListener("click", function(){
        table.print(true, true);
     });
}

main();