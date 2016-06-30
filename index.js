var express = require('express');
var app = express();
var path = require('path');
var io = require('socket.io');
var utils = require('./server/utils');
var Player = require('./server/player.constructor');
var Unit = require('./server/unit.constructor').Unit;
var Hero = require('./server/unit.constructor').Hero;

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/browser/'));
app.use(express.static(__dirname + '/node_modules/'));

var gameConfig = require('./config.json');

var quadtree = require('simple-quadtree');
var tree = quadtree(0, 0, gameConfig.width, gameConfig.height);

var players = {};
var sockets = {};
var removedPlayers = 0; // once it reaches 100 garbage COLLECTION!
var moneyBags = {};

//initially generate money bags for the moneyBags object
for (var i = 0; i < 200; i++) {
	//values of array represent x and y. later, change this so that x = max x of canvas and y is max y of canvas
	moneyBags[[utils.getRandomNum(2000), utils.getRandomNum(1000)]] = {value : utils.getRandomNum(75, 150)};
}

moneyBags.count = Object.keys(moneyBags).length - 1;


function addPlayer (playerData, socketId) {
	players[socketId] = playerData;
}

function removePlayer (socket) {
    delete sockets[socket.id];
    delete players[socket.id];
}


// function sendUpdates () {
//     for (var player in players){
//         if (sockets[player.id]) sockets[player.id].emit('gameUpdate', 'asdf');
//     }
// }

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

var server = app.listen(3030, function () {
  console.log('App listening on port 3030!');
});

io = io.listen(server);

io.on('connection', function (socket) {
    var currentPlayer = new Player(socket.id);

    sockets[socket.id] = socket;

    socket.on('respawn', function (newPlayerData) {

        //currentPlayer.userName = newPlayerData.username // TODO

        socket.emit('playersArray', players); //to see everyone else
        socket.broadcast.emit('otherPlayerJoin', currentPlayer);

        currentPlayer.units[0] = new Hero([200,200]);

        addPlayer(currentPlayer, socket.id);
        socket.emit('gameReady', {playerData: currentPlayer, moneyBags: moneyBags});
        
    });

    socket.on('disconnect', function () {
        removePlayer(socket); // removes them from players array AND sockets obj

        socket.broadcast.emit('otherPlayerDC', socket.id);
        socket.disconnect();
    });

    socket.on('playerMoves', function (playerData) {
    	socket.broadcast.emit('otherPlayerMoves', playerData);
    })

    socket.on('moneyDiscovered', function (moneyData) {
    	//increase the wealth of the player
    	//player[moneyData.playerId][money] += moneyData.value;
    	delete moneyBags[moneyData];
    	//replenish the moneyBags object
    	moneyBags[[utils.getRandomNum(512), utils.getRandomNum(480)]] = {value : utils.getRandomNum(75, 175)};
        socket.emit('moneyBagsUpdate', moneyBags);

    })
});


// setInterval(sendUpdates, 1000);
