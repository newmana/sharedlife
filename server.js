var express = require('express');
var app     = express.createServer();
var io      = require('socket.io').listen(app);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.set('log level', 1);                    // reduce logging
io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

var map     = require('./gof.js').Map([1000, 1000]);
setInterval(function() {
	map.update();
  process.stdout.write('.');
  io.sockets.volatile.emit('state', JSON.stringify(map.getCellMap(200,150)));
}, 500);

app.configure(function () {
	app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});
app.set("view options", { layout: false }) 

app.get('/', function(req, res){
  res.render('index.html');
});
app.get('/data', function(req, res){
  process.stdout.write('r');
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(map.getCellMap()));
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
var port = process.env.NODE_ENV === 'production' ? 80 : 8080
app.listen(port);
console.log('game of life server running at http://127.0.0.1:'+port+'/');
