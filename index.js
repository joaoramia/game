var express = require('express');
var app = express();
var path = require('path');
var io = require('socket.io');
var utils = require('./server/utils');
var Player = require('./server/player.constructor');
var Unit = require('./server/unit.constructor').Unit;
var Hero = require('./server/unit.constructor').Hero;
var Soldier = require('./server/unit.constructor').Soldier;
var Bar = require('./server/unit.constructor').Bar;

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/browser/'));
app.use(express.static(__dirname + '/node_modules/'));

var gameConfig = require('./config.json');

// currently not used
// var quadtree = require('simple-quadtree');
// var tree = quadtree(0, 0, gameConfig.width, gameConfig.height);

// rBush
var tree = require('rbush')();


// all the objects on the canvas
var players = {};
var sockets = {};
var units = {};
var buiildings = {};
var moneyBags = {count: 0};
var currentKing;
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

        // emit the current object of players then add your player no the array
        socket.emit('playersArray', players); //to see everyone else

        addPlayer(currentPlayer);

        //assign current player as king if he is the first one to join
        if (Object.keys(players).length < 2) {
            changeKing(currentPlayer.id);
        }

        socket.emit('gameReady', {playerData: currentPlayer, moneyBags: moneyBags}, currentKing);
        socket.broadcast.emit('otherPlayerJoin', currentPlayer);
    });

    socket.on('disconnect', function () {
        console.log("hey user has left ", socket.id)
        removePlayer(socket); // removes them from players AND sockets collections

        //if a king disconnects, search again for the new king
        if (socket.id === currentKing){
            if (Object.keys(players).length > 0){
                var currentRichest;
                for (var id in players){
                    if(!currentRichest){
                        currentRichest = players[id];
                    }
                    else if (players[id].wealth > currentRichest.wealth){
                        currentRichest = players[id];
                    }
                }
                changeKing(currentRichest.id);
            }
            else {
                currentKing = undefined;
            }
            socket.broadcast.emit('newKing', currentKing);
        }
        socket.broadcast.emit('otherPlayerDC', socket.id);
        socket.disconnect();
    });

    socket.on('playerMoves', function (playerData) {
    	socket.broadcast.emit('otherPlayerMoves', playerData);
    })

    socket.on('moneyDiscovered', function (moneyBagData) {
    	//increase the wealth of the player
    	players[moneyBagData.playerId].wealth += moneyBagData.value;

        //check if this player's wealth becomes higher than the king's
        if (players[moneyBagData.playerId].wealth > players[currentKing].wealth){
            changeKing(moneyBagData.playerId, currentKing);
            io.emit('newKing', currentKing);
        }

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

    socket.on('checkIfPlayerCanBuildBar', function(data){
        if (data.request === 1) {
            if (players[data.id].wealth < 2000) {
                socket.emit('buildBar', false);
            } else {
                socket.emit('buildBar', true);
            }
        } else if (data.request === 2) {

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

function addEntities () {
    tree.add()
}

function removePlayer (socket) {
    delete sockets[socket.id];
    delete players[socket.id];
}

function changeKing (newKing, previousKing){
    if(previousKing) players[previousKing].isKing = false;
    players[newKing].isKing = true;
    currentKing = newKing;
}