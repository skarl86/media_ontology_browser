/**
 * Created by NK on 2016. 5. 23..
 */

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    for (var i = 0, f; f = files[i]; i++) {
        //var output = createGPSData(files[i]);
        //var output = createDurationTime(files[i]);
        var file = files[i];

        // 파일 -> String
        fileToStringByLine(file);
    }
}

function fileToStringByLine(file){
    var reader = new FileReader();
    places = [];
    reader.onload = function(progressEvent){

        var lines = this.result.split('\n');
        createMediaOntologyVideoDictionaly(lines);

    };

    reader.readAsText(file);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);