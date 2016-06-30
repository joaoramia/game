var socket = io.connect('http://' + ip + ':3030');

// The main game loop
var lastTime,
    birthTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    if (rightClick.x && rightClick.y){
        walk(rightClick.x, rightClick.y, dt);
    }

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat');

    //document.getElementById('play-again').addEventListener('click', function() {
    //    reset();
    //});
    //reset();
    lastTime = Date.now();
    birthTime = Date.now();
    main();

    socket.emit('respawn', {});
    socket.emit('moneyBagsCoordsOnUserLogin', {});

    viewCanvas.addEventListener('mousedown', mouseDown, false);
    viewCanvas.addEventListener('mouseup', mouseUp, false);
    viewCanvas.addEventListener('mousemove', mouseMove, false);
}

resources.load([
    'img/sprites2.png',
    'img/capguy-walk-asset.png',
    'img/terrain.png',
    'img/money-bag-asset.png'
]);
resources.onReady(init);

// Game state
var moneyBags = {};

var player = {
    units: [],
    pos: [0,0],
};

var otherPlayers = {};

var currentSelection = [];

var otherPlayerSelection = [];

socket.on('otherPlayerJoin', function (otherPlayerData) {
    console.log(otherPlayerData.id + ' has joined!');
    otherPlayerData.units.forEach(function(unit){
        unit.sprite = generateSprite(unit.type);
    });
      //new Sprite('img/capguy-walk-asset.png', [0, 0], [46, 81], 16, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', true);
    otherPlayers[otherPlayerData.id] = otherPlayerData;
});

socket.on('moneyBagsUpdate', function (moneyBagsFromServer){
    moneyBags = moneyBagsFromServer;
    delete moneyBags.count;
    for (var moneyBag in moneyBags) {
        if (moneyBags.hasOwnProperty(moneyBag)) {
            var coords = moneyBag.split(",");
            coords[0] = parseInt(coords[0]);
            coords[1] = parseInt(coords[1]);
            moneyBags[moneyBag].pos = coords;
            moneyBags[moneyBag].sprite = new Sprite('img/money-bag-asset.png', [0,0], [10,25], 1, [-1]); 
        }
    }
})

socket.on("gameReady", function(playerData) {
    player = playerData;
    player.units.forEach(function (unit) {
        unit.sprite = generateSprite(unit.type);
    })
    drawViewport();
})

socket.on("playersArray", function(playersCollection){
    otherPlayers = playersCollection;

    for (var player in otherPlayers){
        //assign each unit for each player its appropriate sprite
        player.units.forEach(function (unit) {
            unit.sprite = generateSprite(unit.type);
        })

    }
});




socket.on('otherPlayerDC', function (socketId) {
    delete otherPlayers[socketId];
})


var bullets = [];
var enemies = [];
var explosions = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

var score = 0;
var scoreEl = document.getElementById('score');

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;

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

    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
    }

    for (var player in otherPlayers){
        renderEntities(player.units);
    }


    renderSelectionBox();

    renderEntities(moneyBags);
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

