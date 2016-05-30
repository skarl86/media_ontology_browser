/**
 * Created by NK on 2016. 5. 26..
 */
var file = "data/new_media_video.json";
var jqxhr = $.getJSON( file , function() {
        console.log( "success" );
    })
    .done(function() {
        console.log( "second success" );
    })
    .fail(function() {
        console.log( "error" );
    })
    .always(function() {
        console.log( "complete" );
    });


// Perform other work here ...

// Set another completion function for the request above
jqxhr.complete(function(data) {
    console.log( "second complete" );
    var json = jqxhr.responseJSON;

    for(var keyVideo in json){
        $('#video-group').append(
            '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
            '<a data-toggle="collapse" href="#' + keyVideo + '">'+ keyVideo + '  <span class="badge">'+ json[keyVideo].length +'</span></a>'+
            '</h4>' +
            '</div>' +
            '<div id="' + keyVideo + '" class="panel-collapse collapse">' +
            '<ul id="shot-list" class="list-group">' +
            makeShotList(json[keyVideo]) +
            '</ul>'+
                //'<div class="panel-footer">Footer</div>'+
            '</div>'+
            '</div>'
        );
    }
    $('a[href="#shot"]').click(function(){
        var inputShot = $(this).attr('id');
        deletePlaceTable();

        var jqxhr = $.getJSON( file, function() {
                console.log( "success" );
            })
            .done(function() {
                console.log( "second success" );
            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                console.log( "complete" );
            });


// Perform other work here ...

// Set another completion function for the request above
        jqxhr.complete(function(data) {
            var json = jqxhr.responseJSON;
            var videoID = inputShot.split("_")[0];

            var shots = json[videoID];
            shots.forEach(function(shot){
               var elements = shot[inputShot];
                elements.forEach(function(elm){
                    addRow(elm)
                })
            });

        });
        return false;
    });
});

function makeShotList(shots){
    var html = "";

    shots.forEach(function(shotDic){
        for(var shot in shotDic){
            var newShot = shot.split("_")[1];
            html = html.concat(
                '<li class="list-group-item">'+ '<a id=' + shot + ' href=#shot' + '>'+ newShot + '</a></li>'
            )
        }
    });


    return html;
}

function addRow(line) {
    var triple = {s : line.split("\t")[0], p : line.split("\t")[1], o : line.split("\t")[2]};

    $('#triple-table > tbody:last').append(
        '<tr>' +
        '<td class="col-xs-4">' + triple.s + '</td>' +
        '<td class="col-xs-4">' + triple.p + '</td>' +
        '<td class="col-xs-4">' + triple.o + '</td>' +
        '</td>' +
        '</tr>');
}

function deletePlaceTable() {
    $('#triple-table > tbody:last').empty();
}