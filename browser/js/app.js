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
    $( "#game-ui" ).toggleClass( "display-none" );
    $( "#login-screen" ).toggleClass( "display-none" );
    socket.emit('respawn', {userName: $( "#nick" ).val()});
}

resources.load([
    'img/sprites2.png',
    'img/hero.png',
    'img/terrain.jpg',
    'img/moneybag.png',
    'img/soldier-asset.png',
    'img/bar-asset.png',
    'img/king.png',
    'img/desert1.1.png', 'img/desert1.2.png', 'img/desert1.3.png', 'img/desert1.4.png', 'img/desert1.5.png', 'img/desert1.6.png', 'img/desert1.7.png', 'img/desert1.8.png', 'img/desert1.9.png', 'img/desert1.10.png', 'img/desert1.11.png', 'img/desert1.12.png', 'img/desert1.13.png', 'img/desert1.14.png', 'img/desert1.15.png',
    'img/ruinbuild1.png',
    'img/poiseplant.png',
    'img/tree.png',
    'img/cactus.png',
    'img/road.png'
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

var tilesMap = [];
var brightCactusMap = [];
var darkCactusMap = [];

function drawTiles (){
  for (var i = 0; i < canvas.width; i += 64){
    for (var j = 0; j < canvas.height; j+= 64){
        tilesMap.push({img: "img/desert1." + (Math.floor(Math.random() * 15) + 1) + ".png", x: i, y: j});
        if (j % 5 === 0 && Math.random() > 0.9) brightCactusMap.push({x: i, y: j});
        if (j % 6 === 0 && Math.random() < 0.1) darkCactusMap.push({x: i, y: j});
    }
  }
}

drawTiles();

function init() {
    // terrainPattern = ctx.createPattern(resources.get('img/desert1.15.png'), 'repeat');

    // terrainPattern = resources.get('img/desert1.13.png');

    // var image = new Image();
    //
    // image.src = 'img/desert1.2.png';
    //
    // image.onload = function(){
    //     ctx.drawImage(this, 0, 0, 1000, 1000);
    // }

    // drawTiles();
    // ctx.drawTile(resources.get('img/desert1.10.png'), 0,0);
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
var terrainPattern;

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

    renderTerrain(); // terrain in the background

    generateCactuses();
    // ctx.fillStyle = ctx.drawImage(resources.get('img/cactus.png'), 100, 100);
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


function renderTerrain () {
    tilesMap.forEach(function(obj, index){
      ctx.fillStyle = ctx.drawImage(resources.get(obj.img), obj.x, obj.y);
    })

    darkCactusMap.forEach(function(obj){
      ctx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    })
    // ctx.fillStyle = ctx.drawImage(resources.get('img/cactus.png'), 100, 10);
    // ctx.fillStyle = ctx.drawImage(resources.get('img/tree.png'), 300, 300);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateCactuses(){
    brightCactusMap.forEach(function(obj){
      ctx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    })
    // for (var i = 0; i < canvas.width; i += 100){
    //   for (var j = 0; j < canvas.height; j += 50){
    //     if (Math.random() > 0.9) ctx.drawImage(resources.get('img/cactus.png'), i, j);
    //   }
    // }
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
