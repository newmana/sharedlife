var express = require('express');
var app     = express.createServer();

var map     = require('./gof.js').Map([500, 150]);
setInterval(function() {
	map.update();
}, 500);

app.configure(function () {
	app.use(express.bodyParser());
  app.use(express.static(__dirname + '/gof'));
});
app.set("view options", { layout: false }) 

app.get('/', function(req, res){
  res.render('index.html');
});
app.get('/data', function(req, res){
	console.log("request")
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(map));
});
app.post('/data/add', function(req, res){
	console.log("adding cells");

	var data = JSON.parse(req.body.data);
	var myX = JSON.parse(req.body.x);
	var myY = JSON.parse(req.body.y);
	var height = data.length;
	var width = data[0].length;
	for (var y = 0; y<height; y++) {
		for (var x = 0; x<width; x++) {
			map.setAt(x+myX, y+myY, data[y][x]);
		}
	}
  res.end();
});

app.listen(8080);
console.log('game of life server running at http://127.0.0.1:8080/');
