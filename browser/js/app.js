var socket = io.connect('http://' + ip + ':3030');

function setupSocket (socket) {

    socket.on('otherPlayerJoin', function (otherPlayerData) {
        console.log(otherPlayerData.id + ' has joined!');
        // generate the new players sprites
        otherPlayerData.units.forEach(function(unit){
            unit.sprite = generateSprite(unit.type, true);
            console.log("unite log", unit.sprite);
        });
        otherPlayers[otherPlayerData.id] = otherPlayerData;

    });

    socket.on('otherPlayerDC', function (socketId) {
        console.log(socketId + ' left!!!!!');
        delete otherPlayers[socketId];
    });
}

socket.emit('respawn', {});

resources.load([
    'img/sprites2.png',
    'img/hero.png',
    'img/terrain.png',
    'img/moneybag.png'
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
    terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    lastTime = Date.now();
    
    socket.on("playersArray", function(playersCollection){
        console.log("all the players", playersCollection)
        otherPlayers = playersCollection;



        for (var otherPlayer in otherPlayers){

            if (otherPlayers.hasOwnProperty(otherPlayer)){
                //for each player assign each unit its appropriate sprint
                otherPlayers[otherPlayer].units.forEach(function (unit) {
                    unit.sprite = generateSprite(unit.type, true);
                    console.log("current unit", unit.sprite);
                });
            }
            //
            //
            ////for each player assign each unit its appropriate sprite
            //otherPlayers[otherPlayer].units.forEach(function (unit) {
            //    unit.sprite = generateSprite(unit.type, false);
            //
            //})
        }
    });

    socket.on("gameReady", function(gameData) {
        player = gameData.playerData;
        player.units.forEach(function (unit) {
            unit.sprite = generateSprite(unit.type, true);
        })
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



// Game state
var moneyBags = {};

var player = {
    units: [],
    pos: [0,0],
};

var otherPlayers = {};
var currentSelection = [];


var gameTime = 0;
var terrainPattern;

var score = 0;
var scoreEl = document.getElementById('score');

// Update game objects
function update(dt) {
    gameTime += dt;

    if (rightClick.x && rightClick.y){
        walk(rightClick.x, rightClick.y, dt);
    }

    handleInput(dt);

    checkCollisions();

    scoreEl.innerHTML = score;

    socket.emit("playerMoves", player);

    socket.on("otherPlayerMoves", function(playerData) {
        otherPlayers[playerData.id]=playerData;

    });

    drawViewport();

};


function checkPlayerBounds() {
    // Check bounds

    player.units.forEach(function(unit){
        if(unit.pos[0] < 0) {
            unit.pos[0] = 0;
        }
        else if(unit.pos[0] > canvas.width - unit.sprite.size[0]) {
            unit.pos[0] = canvas.width - unit.sprite.size[0];
        }

        if(unit.pos[1] < 0) {
            unit.pos[1] = 0;
        }
        else if(unit.pos[1] > canvas.height - unit.sprite.size[1]) {
            unit.pos[1] = canvas.height - unit.sprite.size[1];
        }
    })
}

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //console.log("player units ", player.units)
    renderEntities(player.units);

    for (var key in otherPlayers){
        console.log("object of toher playees", otherPlayers[key])
        if (otherPlayers.hasOwnProperty(key))
            renderEntities(otherPlayers[key].units);
    }

    renderSelectionBox();

    renderEntities(moneyBags);
    cameraPan(currentMousePosition);
};

function renderEntities(list) {
    if (Array.isArray(list)){
        for(var i=0; i<list.length; i++) {
            renderEntity(list[i]);
        }
    } else if (typeof list === "object") {
        for (var item in list) {
            renderEntity(list[item]);
        }
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    console.log("gotcha!!!!", entity);
    entity.sprite.render(ctx);
    ctx.restore();
}

function renderSelectionBox(){
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
}

