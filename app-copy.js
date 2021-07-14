var fs = require('fs');
const readline = require('readline');
let maxfiles = 232;
let index = 0;
let counter = 1;
function loadData() {
    if (index <= maxfiles) {
        let indexString = index < 10 ? "0" + index : index;
        if (index >= 90) {
            indexString = 9000 + counter;
            counter++;
        }
        let fileName = 'expedia' + indexString;
        //console.log('gsutil cp '+fileName+'.jsonl gs://expedia-static-data');
        console.log('bq load --source_format=NEWLINE_DELIMITED_JSON suppliers_dashboard._expedia_static_data gs://expedia-static-data/'+fileName+'.jsonl');
        index++;
        loadData(index);
    }
}

loadData();



