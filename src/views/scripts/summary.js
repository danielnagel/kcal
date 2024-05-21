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
        printAsHtml:true, //enable html table printing
        printStyled:true,
        groupBy: "date",
        columns:[ //Define Table Columns
            {title:"what", field:"what", width: 80},
            {title:"date", field:"date", width: 90},
            {title:"time", field:"time", width: 50},
            {title:"kcal", field:"kcal", width: 50},
            {title:"comment", field:"comment", width: 80, print: false},
        ],
    });

    //trigger an alert message when the row is clicked
    table.on("rowClick", function(e, row){ 
        alert("Row " + row.getData().id + " Clicked!!!!");
    });

    document.getElementById("print-table").addEventListener("click", function(){
        table.print(false, true);
     });
}

main();