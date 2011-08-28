var express = require('express');
var app     = express.createServer();

var map     = require('./gof.js').Map([100, 100]);
setInterval(function() {
	map.update();
}, 2000);

app.configure(function () {
  app.use(express.static(__dirname + '/gof'));
});
//app.register('.html', require('ejs'));
app.set("view options", { layout: false }) 

app.get('/', function(req, res){
  res.render('index.html');
});
app.get('/data', function(req, res){
	console.log("request")
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(JSON.stringify(map));
});

app.listen(8080);
console.log('game of life server running at http://127.0.0.1:8080/');
