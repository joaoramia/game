var express = require('express');
var app = express();
var path = require('path');
var io = require('socket.io');
var utils = require('./server/utils');
var Player = require('./server/player.constructor');
var Unit = require('./server/unit.constructor').Unit;
var Hero = require('./server/unit.constructor').Hero;
var Soldier = require('./server/unit.constructor').Soldier;

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/browser/'));
app.use(express.static(__dirname + '/node_modules/'));

var gameConfig = require('./config.json');

// currently not used
var quadtree = require('simple-quadtree');
var tree = quadtree(0, 0, gameConfig.width, gameConfig.height);

// all the objects on the canvas
var players = {};
var sockets = {};
var moneyBags = {count: 0};
generateMoneyBags(100);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

var server = app.listen(3030, function () {
  console.log('App listening on port 3030!');
});

io = io.listen(server);

io.on('connection', function (socket) {
    console.log("hey user has joined ", socket.id)
    var currentPlayer = new Player(socket.id);

    sockets[socket.id] = socket;

    // when the new user joins!
    socket.on('respawn', function (newPlayerData) {

        currentPlayer.userName = newPlayerData.userName;
        currentPlayer.id = socket.id;
        currentPlayer.units[0] = new Hero([200,200]);
        currentPlayer.units[1] = new Soldier([300, 300]);
        currentPlayer.unitNumber = 2;

        // emit the current array of players then add your player no the array
        socket.emit('playersArray', players); //to see everyone else


        addPlayer(currentPlayer);

        socket.emit('gameReady', {playerData: currentPlayer, moneyBags: moneyBags});
        socket.broadcast.emit('otherPlayerJoin', currentPlayer);
        
    });

    socket.on('disconnect', function () {
        console.log("hey user has left ", socket.id)
        removePlayer(socket); // removes them from players AND sockets collections

        socket.broadcast.emit('otherPlayerDC', socket.id);
        socket.disconnect();
    });

    socket.on('playerMoves', function (playerData) {
    	socket.broadcast.emit('otherPlayerMoves', playerData);
    })

    socket.on('moneyDiscovered', function (moneyBagData) {
    	//increase the wealth of the player
    	players[moneyBagData.playerId].wealth += moneyBagData.value;
        //change object representing available money on all clients

        var newBagKeyName = generateMoneyBags(1);

        var bagUpdate = {
            deletedBagName: moneyBagData.name,
            newBagName: newBagKeyName.join(","),
            newBagValue: moneyBags[newBagKeyName]
        }
        console.log(bagUpdate);
        io.emit('deleteAndUpdateMoneyBags', bagUpdate);
    	delete moneyBags[moneyBagData.name];
    	//replenish the moneyBags object
    	generateMoneyBags(1);
    })

    socket.on('checkIfPlayerHasEnoughMoneyForBar', function(id){
        if (player[id].wealth < 1200) {
            socket.emit('buildBar', false);
        } else {
            
        }
    })

});


//initially generate money bags for the moneyBags object
function generateMoneyBags(count){
    moneyBags.count = Object.keys(moneyBags).length - 1 + count;
    if (count === 1) {
        var keyName = [utils.getRandomNum(2000), utils.getRandomNum(1000)]
        moneyBags[keyName] = {value : utils.getRandomNum(25, 75)};
        return keyName;

    } else {
        for (var i = 0; i < count; i++) {
            //values of array represent x and y. later, change this so that x = max x of canvas and y is max y of canvas
            moneyBags[[utils.getRandomNum(2000), utils.getRandomNum(1000)]] = {value : utils.getRandomNum(25, 75)};
        }
    }
}


function addPlayer (playerData) {
    players[playerData.id] = playerData;
}

function removePlayer (socket) {
    delete sockets[socket.id];
    delete players[socket.id];
}


