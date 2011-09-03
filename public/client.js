var socket = io.connect();

socket.on('state', function (data) {
	var field = JSON.parse(data);
	
	drawField(field);
});

var CELL_WIDTH;
var CELL_HEIGHT;

this.drawField = function(data) {
	var field = $("canvas");
	field.clearCanvas();

	var mapHeight = data.height;
	var mapWidth = data.width;
	
	var scale = 1.0;

	var cellSpacing = 1;
	
	var outerCellWidth = ((field.width()-(cellSpacing)) / mapWidth) * scale;
	var outerCellHeight = ((field.height()-(cellSpacing)) / mapHeight) * scale;

	CELL_WIDTH = outerCellWidth;
	CELL_HEIGHT = outerCellHeight;
	
	var innerCellWidth = outerCellWidth - cellSpacing;
	var innerCellHeight = outerCellHeight - cellSpacing;
	
	for (var y = 0; y < mapHeight; y++) {
		for (var x = 0; x < mapWidth; x++) {
			var cellIndex = (y*mapWidth)+x;
			if (data.cells[cellIndex] === "1") {
				field.drawRect({
					fillStyle: "green", x: cellSpacing + x * outerCellWidth, y: cellSpacing + y * outerCellHeight, width: innerCellWidth, height: innerCellHeight, fromCenter: false
				});
			}
		}
	}
};

$(function () {
	$("canvas").mousedown(function(eventData) {
		send([eventData.offsetX, eventData.offsetY]);
	});
});

this.convertMouseCoords = function(mousePos) {
    var x = parseInt(mousePos[1] / CELL_WIDTH, 10);
    var y = parseInt(mousePos[0] / CELL_HEIGHT, 10);
    return { x: x, y: y};
};
    
this.send = function(mousePos) {
    var coords = this.convertMouseCoords(mousePos);
    if (coords.x < 0 || coords.y < 0) return;
    //if (coords.y >= W || coords.x >= H) return;
    var selected = parseInt($('#weapon').val());
    switch (selected) {
        case 1:
            this.lightweightSpaceship(coords);
            break;
        case 2:
            this.sendGlider(coords);
            break;
        case 3:
            this.sendDot(coords);
            break;
        default:
            return
    }
};

this.lightweightSpaceship = function(coords) {
    var glider = {
        x: coords.x,
        y: coords.y,
        data: JSON.stringify([
            [false, true, false, false, true],
            [true, false, false, false, false],
            [true, false, false, false, true],
            [true, true, true, true, false]
        ])
    };
    this.sendJsonTo(glider);
};

this.sendGlider = function(coords) {
    var glider = {
        x: coords.x,
        y: coords.y,
        data: JSON.stringify([
            [false, true, false],
            [false, false, true],
            [true, true, true]
        ])
    };
    this.sendJsonTo(glider);
};

this.sendDot = function(coords) {
    var point = {
        x: coords.x,
        y: coords.y,
        data: JSON.stringify([
            [true]
        ])
    }
    this.sendJsonTo(point);
};

this.sendJsonTo = function(newBits) {
	$.post('/data/add', newBits);
};
