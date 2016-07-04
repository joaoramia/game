var socket = io.connect('http://' + ip + ':3030');
var currentKing;

function setupSocket (socket) {

    socket.on('otherPlayerJoin', function (otherPlayerData) {
        console.log(otherPlayerData.id + ' has joined!');

        // generate the new players sprites
        for (var unitId in otherPlayerData.units) {
            var unit = otherPlayerData.units[unitId];
            unit.sprite = generateSprite(unit.type, false, otherPlayerData.id);
        }
        otherPlayers[otherPlayerData.id] = otherPlayerData;

    });

    socket.on('otherPlayerDC', function (socketId) {
        console.log(socketId + ' left!');
        delete otherPlayers[socketId];
    });
}

socket.on('newKing', function(newKing){
    currentKing = newKing;
})

function start(){
    //$( "#game-ui" ).toggleClass( "display-none" );
    //$( "#login-screen" ).toggleClass( "display-none" );
    //$("#building-info-panel").hide();
    socket.emit('respawn', {userName: $( "#nick" ).val()});
}

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
        console.log("all the players", playersCollection)
        otherPlayers = playersCollection;

        /*
        for each of the other players, assign each unit,
        its appropriate sprite
        */

        for (var otherPlayer in otherPlayers){
            if (otherPlayers.hasOwnProperty(otherPlayer)){
                //for each player assign each unit its appropriate sprint
                for (var unitId in otherPlayer.units) {
                    var unit = otherPlayer.units[unitId];
                    unit.sprite = generateSprite(unit.type, false, otherPlayer.id);
                }
            }
        }
    });

    socket.on("gameReady", function(gameData, king) {
        console.log(gameData);
        currentKing = king;
        player = gameData.playerData;
        wealth = gameData.playerData.wealth;
        $("#player-wealth-display").text(wealth);
        for (var unitId in player.units) {
            var unit = player.units[unitId];
            unit.sprite = generateSprite(unit.type, true, player.id);
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

var currentSelection = [];

var buildMode = {
    on: false,
    type: ""
}

var gameTime = 0;

var wealth = 0;

// Update game objects
function update(dt) {

    gameTime += dt;

    walk(dt);

    handleInput(dt);

    checkCollisions();

    socket.emit("playerMoves", player);
    //socket.emit("playerMoves", {id: player.id, unitsPos: getUnitPosByPlayer(player)});

    socket.on("otherPlayerMoves", function(playerData) {
        otherPlayers[playerData.id]=playerData;
        //setUnitPosByPlayer(otherPlayers[playerData.id], playerData.units);
    });

    drawViewport();

};


// function checkPlayerBounds() {
//     // Check bounds

//     player.units.forEach(function(unit){
//         if(unit.pos[0] < 0) {
//             unit.pos[0] = 0;
//         }
//         else if(unit.pos[0] > canvas.width - unit.sprite.size[0]) {
//             unit.pos[0] = canvas.width - unit.sprite.size[0];
//         }

//         if(unit.pos[1] < 0) {
//             unit.pos[1] = 0;
//         }
//         else if(unit.pos[1] > canvas.height - unit.sprite.size[1]) {
//             unit.pos[1] = canvas.height - unit.sprite.size[1];
//         }
//     })
// }
// Draw everything

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

    renderSelectionBox();

    // cameraPan(currentMousePosition);
};

function renderEntities(list, playerId) {
    if (Array.isArray(list)){
        for(var i=0; i<list.length; i++) {
            renderEntity(list[i], playerId);
        }
    } else if (typeof list === "object") {
        for (var item in list) {
            renderEntity(list[item], playerId);
        }
    }
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
