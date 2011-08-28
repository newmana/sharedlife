var field = require('./gof.js'),
		map 	= field.Map([100, 100]);
setInterval(function() {
	map.update();
}, 2000);

var http = require('http');
http.createServer(function (req, res) {
	console.log("request")
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(map));
}).listen(8080);
console.log('game of life server running at http://127.0.0.1:8080/');
