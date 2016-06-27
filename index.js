var express = require('express');
var app = express();
var path = require('path');
var io = require('socket.io');
var utils = require('./utils');

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/browser/'));
app.use(express.static(__dirname + '/node_modules/'));


var gameConfig = require('./config.json');

var quadtree = require('simple-quadtree');
var tree = quadtree(0, 0, gameConfig.width, gameConfig.height);

var players = [];
var men = [];
var sockets = {};

function addMan (manToAdd, socketId) {
	manToAdd.id = socketId;
	manToAdd.x = utils.getRandomNum();
	manToAdd.y = utils.getRandomNum();
	men.push(manToAdd);
	tree.put(manToAdd);
}

function removeMan (manToRemove) {
	var removeIndex = men.indexOf(manToRemove);
	men.splice(removeIndex, 1);
	tree.remove(manToRemove);
}

function addPlayer(playerData, socketId) {
	playerData.id = socketId
	players.push(playerData);
}

function moveLoop () {
	for (var i = 0; i < men.length; i++) {
		trackMan(men[i]);
	}
}

function trackMan (man) {
	moveMan(man);

	tree.clear();
	men.forEach(tree.put);
}

function moveMan (man) {

}

function sendUpdates () {
	players.forEach(function (player) {
		sockets[player.id].emit('gameUpdate', 'asdf');
	});
}

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

var server = app.listen(3030, function () {
  console.log('Example app listening on port 3030!');
});

io = io.listen(server);

io.on('connection', function (socket) {
    var currentPlayer;
    socket.broadcast.emit('otherPlayerJoin', socket.id);
    sockets[socket.id] = socket;

    socket.on('respawn', function (newPlayerData) {
        console.log(newPlayerData);
        socket.emit('playersArray', players);
        addPlayer(newPlayerData, socket.id);
        currentPlayer = newPlayerData;
        currentPlayer.pos = [400, 400];
        socket.emit('gameReady', currentPlayer);
    });

    socket.on('forceDisconnect', function () {
        socket.broadcast.emit('otherPlayerDC', socket.id + ' has been disconnected');
        socket.disconnect();
    });

    socket.on('playerMoves', function(playerData) {
    	socket.broadcast.emit('otherPlayerMoves', playerData);
    })
});


setInterval(sendUpdates, 1000);
