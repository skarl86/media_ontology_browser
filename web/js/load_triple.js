/**
 * Created by Namgee on 2016. 6. 1..
 */
/**
 * Created by NK on 2016. 5. 26..
 */

var videoTarget = $('#video-loading');
var shotTarget = $('#shot-loading');

var file = "data/new_media_video2.json";
videoTarget.loadingOverlay();
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


jqxhr.complete(function(data) {
    videoTarget.loadingOverlay('remove');
    console.log( "second complete" );
    var json = jqxhr.responseJSON;
    for(var keyVideo in json){
        var video = json[keyVideo];
        var shots = video["shots"];
        var numberOfShot = Object.keys(shots).length
        var label = video.label;

        $('#video-list').append(
            '<li>' +
            '<a href="javascript:;" data-toggle="collapse" data-target="#'+ keyVideo +'">' +
            '<i class="fa fa-fw fa-video-camera"></i>'+ keyVideo +' <span class="badge">'+ numberOfShot +'</span><i class="fa fa-fw fa-caret-down"></i>' +
            '<br><small>[' + label + ']' + '</small></a>'+
            '<ul id="'+ keyVideo + '" class="collapse">' +
            makeShotList(shots) +
            '</ul>' +
            '</li>'
        );
    }
    $('a[href="#shot"]').click(function(){
        var inputShot = $(this).attr('id');
        shotTarget.loadingOverlay();
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


        jqxhr.complete(function(data) {
            shotTarget.loadingOverlay("remove");
            var json = jqxhr.responseJSON;
            var videoID = inputShot.split("_")[0];

            var shots = json[videoID]["shots"];
            for(var shotID in shots){
                for(var i in shots[shotID]){
                    addRow(shotID, shots[shotID][i]);
                }
            }

            $('a[href="#detail"]').click(function(){
                var inputShot = $(this).attr('id');
                console.log(inputShot);
                var videoID = inputShot.split("-")[0].split("_")[0];
                var shotID = inputShot.split("-")[0];
                var property = inputShot.split("-")[2];
                var elementID = inputShot.split("-")[1];

                var shots = json[videoID];
                var shotListByID = shots["shots"][shotID];

                for(var i in shotListByID){
                    if(property in shotListByID[i]){
                        var dic = shotListByID[i];
                        var elements = dic[property];
                        for(var j in elements){
                            var dic = elements[j];
                            if( elementID in dic){
                                addDetailRow(dic[elementID]);
                            }
                        }
                        console.log(elements);
                    }
                }


                return true;
            });
        });
        return false;
    });
});

function addDetailRow(list){

    $('#detail-triple-table > tbody:last').empty();

    var html = "";
    list.forEach(function (line) {
        var triple = {s:line.split("\t")[0], p:line.split("\t")[1], o:line.split("\t")[2]};

        html = html.concat(
            '<tr>'+
            '<td class="col-xs-4">' + triple.s + '</td>' +
            '<td class="col-xs-4">' + triple.p + '</td>' +
            '<td class="col-xs-4">' + triple.o +'</td>'+
            '</tr>'
        )
    });

    $('#detail-triple-table > tbody:last').append(html);

}

function makeShotList(shots){
    var html = "";

    for(var shot in shots){
        var newShot = shot.split("_")[1];
        html = html.concat(
            '<li>' +
            '<a id=' + shot + ' href=#shot' + '> <i class="fa fa-fw fa fa-fw fa-file"></i>'+ newShot +" [None] "+ '</a>' +
            '</li>'
        )
    }

    return html;
}

function addRow(shotID, shotPropDic) {

    var html = "";
    var num = 0;
    var priorProperty = ["Visual", "Aural", "Who", "When", "Location", "Where"];

    priorProperty.forEach(function (p) {
        if(p in shotPropDic){
            num = shotPropDic[p].length;
            if(num > 1){
                addSpanRow(shotID, num, p, shotPropDic[p])
            }else {
                addNotSpanRow(shotID, p, shotPropDic[p])
            }
        }

        delete shotPropDic[p];
    });
    for (var prop in shotPropDic) {
        var p = prop;
        var o = "";

        num = shotPropDic[prop].length;

        if(num > 1){
            addSpanRow(shotID, num, p, shotPropDic[prop])
        }else {
            addNotSpanRow(shotID, p, shotPropDic[prop])
        }
        //for (var propElm in shotPropDic[prop]) {
        //    for (var propValue in shotPropDic[prop][propElm]) {
        //        o = propValue
        //    }
        //    addRow2({p:p, o:o})
        //}

    }
}
function addNotSpanRow(shotID, property, dic){
    var html = ""
    var obj = "";

    for(var propElm in dic){
        for (var propValue in dic[propElm]) {
            obj = propValue
        }

        var refList = [];
        dic[propElm][obj].forEach(function (triple) {
            refList.push([triple.split("\t")[1], triple.split("\t")[2]].join("\t"))
        });

        html = html.concat(
            '<tr>'+
            '<td class="col-xs-3">' + property + '</td>' +
            '<td class="col-xs-4">' + obj + '</td>'+
            '<td class="col-xs-5">' + refList.join("<br>") + '</td>'+
            '</tr>'
        )
    }

    addRow3(html);
}

//'<a data-toggle="collapse" href="#' + keyVideo + '">'+ keyVideo + '  <span class="badge">'+ numberOfShot +'</span>' +

function addSpanRow(shotID, num, property, dic){
    var html = "";
    var obj = "";

    for(var propElm in dic){
        if(propElm == 0){
            html = '<tr>' +
                '<td rowspan=' + num + ' class="col-xs-3">' + property + '</td>';
        }
        for (var propValue in dic[propElm]) {
            obj = propValue
        }
        if(propElm != 0){
            html = html.concat('<tr>')
        }

        var refList = [];
        dic[propElm][obj].forEach(function (triple) {
            refList.push([triple.split("\t")[1], triple.split("\t")[2]].join("\t"))
        });

        html = html.concat(
            '<td class="col-xs-4">' + obj + '</a>'+'</td>'+
            '<td class="col-xs-5">' + refList.join("<br>") + '</td>'+
            '</tr>'
        );
    }

    addRow3(html);

}
function addRow3(html){
    $('#triple-table > tbody:last').append(html);
}

function deletePlaceTable() {
    $('#triple-table > tbody:last').empty();
}