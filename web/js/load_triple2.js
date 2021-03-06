/**
 * Created by NK on 2016. 5. 26..
 */
var file = "data/new_media_video3.json";
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
    console.log( "second complete" );
    var json = jqxhr.responseJSON;
    for(var keyVideo in json){
        var video = json[keyVideo];
        var shots = video["shots"];
        var numberOfShot = Object.keys(shots).length
        var label = video.label;
        $('#video-group').append(
            '<div class="panel panel-default">' +
            '<div id="video" class="panel-heading nk-panel-heading">' +
            '<h3 class="panel-title">' +
            '<a data-toggle="collapse" href="#' + keyVideo + '">'+ keyVideo +
            '</a>'+
            ' <span class="badge">'+ numberOfShot +'</span>' +
            '<p><p>[' + label + ']' +
            '</h3>' +
            '</div>' +
            '<div id="' + keyVideo + '" class="panel-collapse collapse">' +
            '<ul id="shot-list" class="list-group" >' +
            makeShotList(shots) +
            '</ul>'+
                //'<div class="panel-fo oter">Footer</div>'+
            '</div>'+
            '</div>'
        );
    }
    $('a[href="#shot"]').click(function(){
        var inputShot = $(this).attr('id');

        $('#subject-label').empty();
        $('#subject-label').append("Subject : " + inputShot);

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
            '<li class="list-group-item">'+ '<a id=' + shot + ' href=#shot' + '><h4 style="text-indent: 10px">'+ newShot + '</h4></a></li>'
        )
    }

    return html;
}

function addRow(shotID, shotPropDic) {

    var html = "";
    var num = 0;
    var priorProperty = ["hasVisual", "hasAural", "hasWho", "hasWhen", "hasLocation", "hasWhere"];

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
            refList.push([makeBrace(triple.split("\t")[1]), makeBrace(triple.split("\t")[2])].join("\t"))
        });

        html = html.concat(
            '<tr>'+
            '<td class="col-xs-3"><h4 style="text-indent: 5px">' + makeBrace(property) + '</h4></td>' +
            '<td class="col-xs-4"><h4 style="text-indent: 5px">' + makeBrace(obj) + '</h4></td>'+
            '<td class="col-xs-5"><h4>' + refList.join("<p><p>") + '</h4></td>'+
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
                '<td rowspan=' + num + ' class="col-xs-3"><h4 style="text-indent: 5px">' + makeBrace(property) + '</h4></td>';
        }
        for (var propValue in dic[propElm]) {
            obj = propValue
        }
        if(propElm != 0){
            html = html.concat('<tr>')
        }

        var refList = [];
        dic[propElm][obj].forEach(function (triple) {
            refList.push([makeBrace(triple.split("\t")[1]), makeBrace(triple.split("\t")[2])].join("\t"))
        });

        html = html.concat(
            '<td class="col-xs-4"><h4 style="text-indent: 5px">' + makeBrace(obj) + '</h4></td>'+
            '<td class="col-xs-5"><h4>' + refList.join("<p><p>") + '</h4></td>'+
            '</tr>'
        );
    }

    addRow3(html);

}
function makeBrace(str){
    return "&#60;" + str + "&#62;";
}
function addRow3(html){
    $('#triple-table > tbody:last').append(html);
}

function deletePlaceTable() {
    $('#triple-table > tbody:last').empty();
}