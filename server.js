var host = process.env.ADDR || "127.0.0.1";
var port = process.env.PORT || 80;
var WebSocketServer = require('ws').Server;
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');

var server = http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(index);
}).listen(port, host);

wss = new WebSocketServer({
	server: server,
	autoAcceptConnections: false
});

var _id = 0;
var clients = {};
var count = 0;

wss.on('connection', function(ws) {

	_id += 1;
	var id = _id;
	clients[id] = ws;

	ws.on('message', function(message) {
		var tst_msg = JSON.parse(message); //json decode 
		var user_name = tst_msg.name; //sender name
		var user_message = tst_msg.message; //message text
		var response_text = {'type' : 'usermsg', 'name' : user_name, 'message' : user_message};
		for (var key in clients) {
	      clients[key].send(JSON.stringify(response_text));
	    }
	});

	ws.on('close', function() {
	    delete clients[id];
		var response = {'type' : 'system', 'message' : '???' + ' disconnected'};
	    for (var key in clients) {
	      clients[key].send(JSON.stringify(response));
	    }
    });
	
	count += 1;
	var msg = {'type' : 'system', 'message' : 'hello new user', 'yourname' : count};
	ws.send(JSON.stringify(msg));
	var response = {'type' : 'system', 'message' : '???' + ' connected', 'newuser' : count}; //prepare json data
	for (var key in clients) {
      clients[key].send(JSON.stringify(response));
    }
});