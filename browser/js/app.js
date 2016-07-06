var socket = io.connect('http://' + ip + ':3030');
var currentKing;
var tree = rbush();

function setupSocket (socket) {

    socket.on('otherPlayerJoin', function (otherPlayerData) {
        console.log(otherPlayerData.id + ' has joined!');

        var toBeAddedToTree = [];

        newPlayerJoinsAlert(otherPlayerData.username);

        // generate the new players sprites
        for (var unitId in otherPlayerData.units) {
            var unit = otherPlayerData.units[unitId];
            unit.sprite = generateSprite(unit.type, false, otherPlayerData.id);

            toBeAddedToTree.push(prepForUnitTree(unit));
        }
        for (var id in otherPlayerData.buildings) {
            var building = otherPlayerData.building[id];
            building.sprite = generateSprite(building.type, false, otherPlayerData.id);
        }
        otherPlayers[otherPlayerData.id] = otherPlayerData;

        tree.load(toBeAddedToTree);
    });

    socket.on('otherPlayerDC', function (socketId) {
        console.log(socketId + ' left!');


        removeFromTreeOnDisconnect(socketId);

        var departingUserUsername = otherPlayers[socketId].username;
        newPlayerLeavesAlert(departingUserUsername);

        delete otherPlayers[socketId];
    });


    socket.on('takeThat', function (victim, damage) {
        console.log(victim, damage);
        if (player.id === victim.socketId) {
            player.units[victim.id].currentHealth -= damage;
            player.units[victim.id].hit = true;
        } else {
            otherPlayers[victim.socketId].units[victim.id].currentHealth -= damage;
        }
    });
}

socket.on('newKing', function(newKing){
    var previousKing = currentKing;
    currentKing = newKing;
    if (player.id === currentKing) {
        player.units[0].sprite = generateSprite(player.units[0].type, true, player.id);
        if(otherPlayers[previousKing]) otherPlayers[previousKing].units[0].sprite = generateSprite(otherPlayers[previousKing].units[0].type, false, previousKing);
    }
    else if (otherPlayers[currentKing]){
        otherPlayers[currentKing].units[0].sprite = generateSprite(otherPlayers[currentKing].units[0].type, false, currentKing);
        if (otherPlayers[previousKing]) otherPlayers[previousKing].units[0].sprite = generateSprite(otherPlayers[previousKing].units[0].type, false, previousKing);
        if (player.id === previousKing) player.units[0].sprite = generateSprite(player.units[0].type, true, player.id);
    }
});


//start page
function start(){
    // $( "#game-ui" ).toggleClass( "display-none" );
    // $( "#login-screen" ).toggleClass( "display-none" );
    $("#building-info-panel").hide();
    socket.emit('respawn', {userName: $( "#nick" ).val()});
}


// chat-client
$('form').submit(function(){
    socket.emit('chat message', { username: player.username, text: $('#m').val(), msgcolor: "red"});
    $('#m').val('');
    return false;
});

socket.on('chat message', function(msgObj){
    //$('#messages').append($('<li>').text(msgObj.username + " says "+ msgObj.text));
    $('#messages').append($('<li>').text(msgObj.username + " says "+ msgObj.text));
    $('#chat-client .message-panel')[0].scrollTop = 10000;
});



resources.load([
    'img/hero.png',
    'img/hero/hero-0.png', 'img/hero/hero-1.png', 'img/hero/hero-2.png', 'img/hero/hero-3.png', 'img/hero/hero-4.png',
    'img/hero/king.png',    
    'img/moneybag.png',
    'img/soldier-asset.png',
    'img/bar-asset.png',
    'img/background/desert1.1.png', 'img/background/desert1.2.png', 'img/background/desert1.3.png', 'img/background/desert1.4.png', 'img/background/desert1.5.png', 'img/background/desert1.6.png', 'img/background/desert1.7.png', 'img/background/desert1.8.png', 'img/background/desert1.9.png', 'img/background/desert1.10.png', 'img/background/desert1.11.png', 'img/background/desert1.12.png', 'img/background/desert1.13.png', 'img/background/desert1.14.png', 'img/background/desert1.15.png',
    'img/background/cactus.png',
    'img/house-asset.png'
]);


resources.onReady(init);

// The main game loop
var lastTime;

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    start();

    lastTime = Date.now();

    socket.on("playersArray", function(playersCollection){
        
        otherPlayers = playersCollection;

        /*
        for each of the other players, assign each unit,
        its appropriate sprite
        */
        
        var toBeAddedToTree = [];

        for (var otherPlayer in otherPlayers){
            if (otherPlayers.hasOwnProperty(otherPlayer)){
                //for each player assign each unit its appropriate sprint
                for (var unitId in otherPlayers[otherPlayer].units) {
                    var unit = otherPlayers[otherPlayer].units[unitId];
                    unit.sprite = generateSprite(unit.type, false, otherPlayer.id);

                    // add unit to an array built to be inserted into r-Tree
                    // better than adding one by one because bulk insert is way faster
                    toBeAddedToTree.push(prepForUnitTree(unit));
                    
                }
                for (var id in otherPlayers[otherPlayer].buildings) {
                    var building = otherPlayers[otherPlayer].buildings[id];
                    building.sprite = generateSprite(building.type, false, otherPlayer.id);
                }
            }
        }
        tree.load(toBeAddedToTree);
    });

    socket.on("gameReady", function(gameData, king) {
        adjustVPOnGameReady(gameData.playerData.units[0].pos);
        currentKing = king;
        player = gameData.playerData;
        wealth = gameData.playerData.wealth;

        for (var unitId in player.units) {
            var unit = player.units[unitId];
            unit.sprite = generateSprite(unit.type, true, player.id);
        }

        for (var id in player.buildings) {
            var building = player.buildings[id];
            building.sprite = generateSprite(building.type, true, player.id);
        }

        setupMoneyBags(gameData.moneyBags);
        setupSocket(socket);
        drawViewport();
        main();
    })

    viewCanvas.addEventListener('mousedown', mouseDown, false);
    viewCanvas.addEventListener('mouseup', mouseUp, false);
    viewCanvas.addEventListener('mousemove', mouseMove, false);


    socket.on('moneyBagsUpdate', function (moneyBagsFromServer){
        setupMoneyBags(moneyBagsFromServer);
    })

}

socket.on('deleteAndUpdateMoneyBags', function (bagUpdate) {
    delete moneyBags[bagUpdate.deletedBagName];
    moneyBags[bagUpdate.newBagName] = bagUpdate.newBagValue;
    //abstract this away
    var coords = bagUpdate.newBagName.split(",");
    coords[0] = parseInt(coords[0]);
    coords[1] = parseInt(coords[1]);
    moneyBags[bagUpdate.newBagName].pos = coords;
    moneyBags[bagUpdate.newBagName].sprite = generateSprite("moneybag");
})

// Defines some initial global variables that're overwritten when game loads
var moneyBags = {};

var player = {};

var otherPlayers = {};

var buildMode = {
    on: false,
    type: ""
}

var currentSelection = [];

var gameTime = 0;

var wealth = 0;

// Update game objects
function update(dt) {
    gameTime += dt;

    walk(dt);

    handleInput(dt);

    checkCollisions();

    checkCombat();

    removeDeadUnits();

    socket.emit("playerMoves", player);
    //socket.emit("playerMoves", {id: player.id, unitsPos: getUnitPosByPlayer(player)});

    socket.on("otherPlayerMoves", function(playerData) {
        // otherPlayers[playerData.id] = Object.assign(otherPlayers[playerData.id], playerData);
        otherPlayers[playerData.id] = playerData;
        //setUnitPosByPlayer(otherPlayers[playerData.id], playerData.units);
    });

    drawViewport();



};


function render() {

    // the below uses a copy of the canvas (tempCanvas) and if that copy has already been generated, there is no need to render the terrain again, we just assign the original canvas to that copy.
    if (alreadyRendered){
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else {
        renderTerrain();
    }

    generateCactuses();

    renderEntities(moneyBags); // moneybags before units so that units show up in front

    renderEntities(player.units, player.id);

    for (var key in otherPlayers){
        if (otherPlayers.hasOwnProperty(key))
            renderEntities(otherPlayers[key].units, key);
    }

    renderEntities(player.buildings);

    for (var key in otherPlayers){
        if (otherPlayers.hasOwnProperty(key))
            renderEntities(otherPlayers[key].buildings, key);
    }

    renderSelectionBox();
    checkIfGameOver();
    // cameraPan(currentMousePosition);
};

function renderEntities(list, playerId) {
    // if (Array.isArray(list)){
    //     for(var i=0; i<list.length; i++) {
    //         renderEntity(list[i], playerId);
    //     }
    // } else if (typeof list === "object") {
        for (var item in list) {
            renderEntity(list[item], playerId);
        }
    // }
}

function renderEntity(entity, playerId) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    if (!(entity.sprite instanceof Sprite) && entity.sprite){
        entity.sprite.selectable = false;

        Sprite.prototype.render.apply(entity.sprite, [ctx, playerId, entity.type, entity.currentHealth, entity.maxHealth]);
        // entity.sprite.render(ctx);
    }
    else if (entity.sprite){
        entity.sprite.render(ctx, playerId, entity.type, entity.currentHealth, entity.maxHealth);

    }
    ctx.restore();
}

function renderSelectionBox(){
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
}

function getUnitPosByPlayer(player){ 
    var posObj = {}; 
    for (var key in player.units){ 
        posObj[key] = player.units[key].pos; 
    } 
    return posObj; 
}

function setUnitPosByPlayer(player, posObj){ 
    for (var unitId in player.units ){ 
        if (posObj[unitId]) 
            //player.units[unitId].pos = posObj[unitId].pos; 
        console.log("prev pos=", player.units[unitId].pos, "new position= ", posObj[unitId].pos )
    }
 }