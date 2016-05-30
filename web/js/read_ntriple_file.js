/**
 * Created by NK on 2016. 5. 23..
 */

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    //for (var i = 0, f; f = files[i]; i++) {
    //    //var output = createGPSData(files[i]);
    //    //var output = createDurationTime(files[i]);
    //    var file = files[i];
    //
    //    // 파일 -> String
    //    fileToStringByLine(file);
    //}
    readTripleFile()
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

function readTripleFile(){
    var file = "/Users/NK/Workspace/intellij/media_ontology_browser/web/data/media_video.json";

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                console.log(allText)
            }
        }
    };
    rawFile.send(null);
}
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);