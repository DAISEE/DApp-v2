var now = new Date().getTime();

var energyData     = [];
var dataset        = [];
var totalPoints    = 20;
var updateInterval = 8000;
var options        = {
    series: {
        bars: {
            show: true,
            barWidth: 8000,
            align: "right"
        }
    },
    xaxis: {
        mode: "time",
        tickSize: [8, "second"],
        tickFormatter(v, axis) {
            var date = new Date(v);
            if (date.getSeconds() % 20 === 0) {
                var hours   = date.getHours()   < 10 ? "0" + date.getHours()   : date.getHours();
                var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

                return hours + ":" + minutes + ":" + seconds;
            }
            else {
                return "";
            }
        },
        axisLabel: "Time",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 14,
        axisLabelFontFamily: "Verdana, Arial",
        axisLabelPadding: 10
    },
    yaxis: {
        min: 0,
        max: 70,
        tickSize: 10,
        tickFormatter(v, axis) {
            if (v % 10 === 0) {
                return v + " W";
            }
            else {
                return "";
            }
        },
        axisLabel: "Watt",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: "Verdana, Arial",
        axisLabelPadding: 6
    },
    legend: {
        labelBoxBorderColor: "#fff"
    },
};


function initData() {

    energyData.shift(); //to remove first item of array
    while (energyData.length < totalPoints) {
        var y = "";
        var temp = [now += updateInterval, y]; //data format [x, y]
        energyData.push(temp);
    }
    dataset = [{ data: energyData, color: "#FFA812" }];
    $.plot($("#flot-placeholder"), dataset, options);
}

function getData() {
    $.getJSON("/get_data/", function (data) {
        var json = JSON.stringify(data.result);
        var item = JSON.parse(json);
        // var energy = [item.timestamp, item.value]; //data format [x, y]
        var energy = [now += updateInterval, item.value]; //data format [x, y]
        $("#current").text(item.value);

        if (energyData.length > totalPoints) {energyData.shift();}
        energyData.push(energy);
    }) 
    .fail(function() {
        console.log( "Error: getData failed (getJSON)" )
    });
}

function update() {
    getData();
    $.plot($("#flot-placeholder"), dataset, options);
    setTimeout(update, updateInterval);
}

$(document).ready(function () {
    initData();
    update();
});
