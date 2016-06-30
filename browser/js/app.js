var socket = io.connect('http://' + ip + ':3030');

function setupSocket (socket) {
    socket.on('otherPlayerJoin', function (otherPlayerData) {
        console.log(otherPlayerData.id + ' has joined!');
        otherPlayerData.units.forEach(function(unit){
            unit.sprite = generateSprite(unit.type);
        });
          //new Sprite('img/capguy-walk-asset.png', [0, 0], [46, 81], 16, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', true);
        otherPlayers[otherPlayerData.id] = otherPlayerData;
    });

    socket.on('otherPlayerDC', function (socketId) {
        delete otherPlayers[socketId];
    })
}

socket.emit('respawn', {});

resources.load([
    'img/sprites2.png',
    'img/capguy-walk-asset.png',
    'img/terrain.png',
    'img/money-bag-asset.png',
    'img/soldier-asset.png'
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
        otherPlayers = playersCollection;

        /*
        for each of the other players, assign each unit,
        its appropriate sprite
        */

        for (var otherPlayer in otherPlayers){
            otherPlayers[otherPlayer].units.forEach(function (unit) {
                unit.sprite = generateSprite(unit.type, false);

            })
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
}

// Defines some initial global variables that're overwritten when game loads
var moneyBags = {};

var player = {
    units: [],
    pos: [0,0],
};

var otherPlayers = {
};

var currentSelection = [];

var otherPlayerSelection = [];

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

    renderEntities(player.units);

    for (var otherPlayer in otherPlayers){
        renderEntities(otherPlayers[otherPlayer].units);
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
    entity.sprite.render(ctx);
    ctx.restore();
}

function renderSelectionBox(){
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
}

