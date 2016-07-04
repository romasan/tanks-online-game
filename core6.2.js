PLAYER = 'A'
ZADROT = 'B'
ready = false;
online = false;
		var map = [
			[1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
			[0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
			[1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
			[0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
			[1, 0, 1, 1, 0, 0, 0, 0, 1, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
			[0, 1, 0, 1, 0, 0, 0, 0, 0, 0]
		]
		var tank_A = {x : 1, y : 0, direction : 'up'};
		var tank_B = {x : 9, y : 9, direction : 'up'};
		var blocksize = 40;
		
		var draw = function() {
		for(y in map) {
			for(x in map[y]) {
				var url = "skin/free.png"
				if(map[y][x] == 1) {
					url = "skin/stone.png"
				}
				$("#area").append(
					$("<div>").css({
						backgroundImage : "url(" + url + ")",
						width           : blocksize + "px",
						height          : blocksize + "px",
						backgroundSize  : blocksize + "px " + blocksize + "px",
						position        : 'absolute',
						left            : x * blocksize + "px",
						top             : y * blocksize + "px"
					})
				)
			}
		}
		$("#area").append(
			$("<div>").css({
				backgroundImage : "url('skin/tankA.png')",
				width           : blocksize + "px",
				height          : blocksize + "px",
				backgroundSize  : blocksize + "px " + blocksize + "px",
				position        : 'absolute',
				left            : tank_A.x * blocksize + "px",
				top             : tank_A.y * blocksize + "px"
			}).attr({id : "tankA"})
		);
		$("#area").append(
			$("<div>").css({
				backgroundImage : "url('skin/tankB.png')",
				width           : blocksize + "px",
				height          : blocksize + "px",
				backgroundSize  : blocksize + "px " + blocksize + "px",
				position        : 'absolute',
				left            : tank_B.x * blocksize + "px",
				top             : tank_B.y * blocksize + "px"
			}).attr({id : "tankB"})
		);
		}
		var redraw = function() {
			console.log("redraw", tank_A, tank_B)
			var _tankA = {
				left : tank_A.x * blocksize + "px",
				top  : tank_A.y * blocksize + "px",
			}
			switch(tank_A.direction) {
				case "up":_tankA.transform = 'rotate(0deg)';break;
				case "left":_tankA.transform = 'rotate(-90deg)';break;
				case "down":_tankA.transform = 'rotate(180deg)';break;
				case "right":_tankA.transform = 'rotate(90deg)';break;
			}
			var _tankB = {
				left : tank_B.x * blocksize + "px",
				top  : tank_B.y * blocksize + "px",
			}
			switch(tank_B.direction) {
				case "up":_tankB.transform = 'rotate(0deg)';break;
				case "left":_tankB.transform = 'rotate(-90deg)';break;
				case "down":_tankB.transform = 'rotate(180deg)';break;
				case "right":_tankB.transform = 'rotate(90deg)';break;
			}
			$("#tankA").css(_tankA)
			$("#tankB").css(_tankB)
		}
		
		var run = function(tank, ac) {
			if(!online) return;
				console.log(tank, ac)
				tank_Z = tank == 'A' ? tank_A : tank_B
				tank_N = tank == 'B' ? tank_A : tank_B
					if(ac == "left") {
						switch(tank_Z.direction) {
							case "up"    : tank_Z.direction = "left";break;
							case "left"  : tank_Z.direction = "down";break;
							case "down"  : tank_Z.direction = "right";break;
							case "right" : tank_Z.direction = "up";break;
						}
					} else if(ac == "right") {
						switch(tank_Z.direction) {
							case "up"    : tank_Z.direction = "right";break;
							case "left"  : tank_Z.direction = "up";break;
							case "down"  : tank_Z.direction = "left";break;
							case "right" : tank_Z.direction = "down";break;
						}
					} else if(ac == "move") {
						switch(tank_Z.direction) {
							case "up"    : if(tank_Z.y > 0)if(map[tank_Z.y-1][tank_Z.x] == 0 && !(tank_Z.y-1==tank_N.y&&tank_Z.x==tank_N.x))tank_Z.y -= 1;break;
							case "left"  : if(tank_Z.x > 0)if(map[tank_Z.y][tank_Z.x-1] == 0 && !(tank_Z.y==tank_N.y&&tank_Z.x-1==tank_N.x))tank_Z.x -= 1;break;
							case "down"  : if(tank_Z.y < map.length-1)if(map[tank_Z.y+1][tank_Z.x] == 0 && !(tank_Z.y+1==tank_N.y&&tank_Z.x==tank_N.x))tank_Z.y += 1;break;
							case "right" : if(tank_Z.x < map[0].length-1)if(map[tank_Z.y][tank_Z.x+1] == 0 && !(tank_Z.y==tank_N.y&&tank_Z.x+1==tank_N.x))tank_Z.x += 1;break;
						}
					} else if(ac == "fire") {
						switch(tank_Z.direction) {
							case "up"    : if(tank_Z.y > tank_N.y && tank_Z.x == tank_N.x){s=true;for(y in map)if(y < tank_Z.y && y > tank_N.y && map[y][tank_Z.x] == 1)s=false;if(s)win(tank)};break;
							case "left"  : if(tank_Z.y == tank_N.y && tank_Z.x > tank_N.x){s=true;for(y in map[tank_Z.y])if(x < tank_Z.x && x > tank_N.x && map[tank_Z.y][x] == 1)s=false;if(s)win(tank)};break;
							case "down"  : if(tank_Z.y < tank_N.y && tank_Z.x == tank_N.x){s=true;for(y in map)if(y > tank_Z.y && y < tank_N.y && map[y][tank_Z.x] == 1)s=false;if(s)win(tank)};break;
							case "right" : if(tank_Z.y == tank_N.y && tank_Z.x < tank_N.x){s=true;for(y in map[tank_Z.y])if(x > tank_Z.x && x < tank_N.x && map[tank_Z.y][x] == 1)s=false;if(s)win(tank)};break;
						}
					}
				redraw();
		}
var win = function(tank) {
	if(tank == TANK) {
		$('#text').html('You WIN!') 
	} else {
		$('#text').html('Lose! Play again') 
	}
	//online = false;
}
var send_action = function(action) {
	
	var msg = {
		message: action,
		name: PLAYER
	};
//convert and send data to server
websocket.send(JSON.stringify(msg));
}
//++++++++++++++++++++++++++++++++++++++++++
$(document).ready(function(){

	//create a new WebSocket object.
	var wsUri = "ws://localhost:9000/demo/server.php"; 	
	websocket = new WebSocket(wsUri); 
	
	websocket.onopen = function(ev) { // connection is open 
		console.log("Connected!");
	}
	
	//#### Message received from server?
	websocket.onmessage = function(ev) {
		var msg = JSON.parse(ev.data); //PHP sends Json data
		var type = msg.type; //message type
		var umsg = msg.message; //message text
		var uname = msg.name; //user name
		var ucolor = msg.color; //color

		if(type == 'usermsg') 
		{
			if(online != true) {
				data = umsg.split(':')
				console.log(data)
				if(data[0] == "play_with_me" && data[1] == PLAYER) {
					online = true;
					ZADROT = uname
					TANK = 'A'
					$('#text').html('Use your arrow keys and space key on keyboard for play. Your tank is A') 
					var msg = {
					message: "ok:" + uname,
					name: PLAYER
					};
					websocket.send(JSON.stringify(msg));
				}
				if(data[0] == "ok" && data[1] == PLAYER) {
					online = true;
					ZADROT = uname
					TANK = 'B'
					$('#text').html('Use your arrow keys and space key on keyboard for play. Your tank is B') 
				}
			} else {
				if(uname == PLAYER) run(TANK, umsg)
				if(uname == ZADROT) run(TANK == 'A' ? 'B' : 'A', umsg)
			}
		}
		if(type == 'system')
		{
			if(typeof msg.yourname != 'undefined') {
				PLAYER = msg.yourname
			}
			if(typeof msg.newuser != 'undefined') {
				if(msg.newuser != PLAYER) {
					//ZADROT = msg.newuser
					if(online != true) {
						var msg = {
						message: "play_with_me:" + msg.newuser,
						name: PLAYER
						};
						//convert and send data to server
						websocket.send(JSON.stringify(msg));
					}
					
				}
			}
		}
		
		$('#message').val(''); //reset text
	};
	
	websocket.onerror	= function(ev){console.log("Error Occurred - "+ev.data);}; 
	websocket.onclose 	= function(ev){console.log("Connection Closed");};
	
	_left = document.body.clientWidth / 2 - blocksize * map[0].length / 2;
	//_top = document.body.clientHeight / 2 - blocksize * map.length / 2;
	
	$('#area').css({
		position : 'absolute',
		left : _left + 'px',
		top : '100px',
		zIndex : 10
	})

	draw();
	
	document.body.onkeyup = function(e) {
		console.log(e.keyCode);
		switch(e.keyCode) {
			case 37:send_action("left");break;//left
			case 39:send_action("right");break;//right
			case 38:send_action("move");break;//up->forward
			case 32:send_action("fire");break;//space->fire
		}
	}
});
