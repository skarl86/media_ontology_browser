/**
 * Created by NK on 2016. 5. 23..
 */

var HAS_SHOT_PROPERTY = "hasShot";

function createMediaOntologyVideoDictionaly(lines){
    //localStorage['n23'] = lines;

    var videoDictionary = {};

    var videoTriple = lines.filter(parseVideoTriple);
    var videoHasShopTriple = lines.filter(parseHasShotTriple);
    //var videoHasWhoTriple = lines.filter(parseHasWho);

    videoTriple.forEach(function(triple){
        var videoID = extractVideoID(triple);
        var videoShot = videoHasShopTriple.filter(parseShotByVideo(videoID));

        var shots = [];
        videoShot.forEach(function(line){
            var shot = extractShotID(line);
            shots.push(shot);
        });

        videoDictionary[videoID] = shots;
    });

    makeVideoShotList(videoDictionary)
}

function createMediaOntologyShotDictionary(lines){
    var hasWho = [];
    var hasVisual = [];
    var hasWhatObject = [];
    var hasWhatBehavior = [];
    var hasWhere = [];
    var hasLocation = [];
    var hasElement = [];
    var hasAural = [];
    
    lines.forEach(function (line) {
        var triple = makeTriple(line);
        if(triple.p.includes("hasWho")){
            hasWho.push(line);
        }else if(triple.p.includes("hasVisual")){
            hasVisual.push(line);
        }else if(triple.p.includes("hasWhatObject")){
            hasWhatObject.push(line);
        }else if(triple.p.includes("hasWhatBehavior")){
            hasWhatBehavior.push(line);
        }else if(triple.p.includes("hasWhere")){
            hasWhere.push(line);
        }else if(triple.p.includes("hasLocation")){
            hasLocation.push(line);
        }else if(triple.p.includes("hasElement")){
            hasElement.push(line);
        }else if(triple.p.includes("hasAural")){
            hasAural.push(line);
        }
    });
}

function makeVideoShotList(videoDictionary){
    for(var keyVideo in videoDictionary){
        $('#video-group').append(
            '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
            '<a data-toggle="collapse" href="#' + keyVideo + '">'+ keyVideo + '  <span class="badge">'+ videoDictionary[keyVideo].length +'</span></a>'+
            '</h4>' +
            '</div>' +
            '<div id="' + keyVideo + '" class="panel-collapse collapse">' +
            '<ul id="shot-list" class="list-group">' +
            makeShotList(videoDictionary[keyVideo]) +
            '</ul>'+
            //'<div class="panel-footer">Footer</div>'+
            '</div>'+
            '</div>'
        );
    }

    $('a[href="#shot"]').click(function(){
        console.log($(this).attr('id'));

        return false;
    });
}
function makeShotList(shots){
    var html = "";

    shots.forEach(function(shot){
        var newShot = shot.split("_")[1];
        html = html.concat(
            '<li class="list-group-item">'+ '<a id=' + shot + ' href=#shot' + '>'+ newShot + '</a></li>'
        )
    })
    return html;
}

function parseShotByVideo(video){
    return function (line){
        var triple = makeTriple(line);

        var results = false;
        try{
            results = triple.s.includes(video) && triple.p.includes(HAS_SHOT_PROPERTY);
        }catch(e){
            console.log(line,e);

        }
        return results;
    }
}
function extractShotID(line){
    var regexp = /([A-Z])\w+/g;
    var match = regexp.exec(line);

    var results = [];
    while (match != null){
        if(match[0] != null){
            results.push(match[0]);
        }
        match = regexp.exec(line);
    }

    return results[2];
}
function extractVideoID(triple){
    var regexp = /([A-Z])\w+/g;
    var match = regexp.exec(triple);

    return match[0];
}

function parseHasWho(line){
    var triple = makeTriple(line);
    var results = false;
    try{
        results = triple.p.includes("hasWho");
    }catch(e){
        console.log(line,e);

    }
    return results;
}

function parseVideoTriple(line){
    var triple = makeTriple(line);
    var results = false;
    try{
        results = triple.p.includes("#type") && triple.o.includes("http://data.diquest.com/ontology/Video");
    }catch(e){
        console.log(line,e);

    }
    return results;
}

function parseHasShotTriple(line){
    var triple = makeTriple(line);
    var results = false;
    try{
        results = triple.p.includes("hasShot");
    }catch(e){
        console.log(line,e);

    }
    return results;
}

function makeTriple (line) {
    var regexp = /(<[^\s]*>)|(_:[^\s]*)|(\".*\")/g;
    var match = regexp.exec(line);

    var results = [];
    while (match != null){
        if(match[0] != null){
            results.push(match[0]);
        }
        match = regexp.exec(line);
    }

    return { s : results[0], p : results[1], o: results[2] }
}

function addTripleRow(line) {
    var triple = makeTriple(line);

    $('#triple-table > tbody:last').append(
        '<tr>' +
        '<td class="col-xs-4">' + triple.s + '</td>' +
        '<td class="col-xs-4">' + triple.p + '</td>' +
        '<td class="col-xs-4">' + triple.o + '</td>' +
        '</td>' +
        '</tr>');
}
