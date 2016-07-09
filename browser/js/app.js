var socket = io.connect('http://' + ip + ':3030');
var currentKing;
var tree = rbush();
var moneyTree = rbush();

// Defines some initial global variables that're overwritten when game loads
var moneyBags = {};
var player = {};
var otherPlayers = {};
var buildMode = {
    on: false,
    type: ""
}
var currentSelection = [];
var gameStarted = false;
var gameTime = 0;
var wealth = 0;
var gameOver = false;
var colorArray = ["mediumspringgreen", "chartreuse", "black", "aqua", "crimson", "deeppink"];


var displayCurrentPlayersUnits = false;

//start game on user press Play button
function startGame(){
    $("#fullscreen-overlay").hide();
    $("#world-wealth-display").show();
    $("#game-controls").show();
    displayCurrentPlayersUnits = true;
    socket.emit('respawn', {userName: player.username});
}

//assigns a click event to the button on the load screen
$("#login-box button").click(function(){
    // socket.emit('renameUser', {userName: $( "#nick" ).val(), id: player.id});
    player.username = $( "#nick" ).val();
    startGame();
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
    'img/house-asset.png',
    'img/cop-asset.png',
    'img/assault-asset.png'
]);

resources.onReady(init);


// The main game loop
var lastTime;

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();
    calculateFPS();
    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    viewCanvas.addEventListener('mousedown', mouseDown, false);
    viewCanvas.addEventListener('mouseup', mouseUp, false);
    viewCanvas.addEventListener('mousemove', mouseMove, false);

    setupSocket(socket);

    fireSocketForInfo(socket);

    lastTime = Date.now();
    drawViewport();
    main();
}

// Update game objects
function update(dt) {
    gameTime += dt;

    if (gameOver === false && gameStarted) {
        checkIfGameOver();
    }

    walk(dt);

    handleInput(dt);

    checkCollisions();

    checkCombat();

    removeDeadUnits();

    socket.emit("playerMoves", player);

    socket.on("otherPlayerMoves", function(playerData) {
        otherPlayers[playerData.id] = playerData;
    });

    drawViewport();
}



function render() {

    // the below uses a copy of the canvas (tempCanvas) and if that copy has already been generated, there is no need to render the terrain again, we just assign the original canvas to that copy.
    if (alreadyRendered){
        ctx.drawImage(tempCanvas, 0, 0);
    }
    else {
        renderTerrain();
    }
    

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    generateCactuses();

    renderEntities(moneyBags); // moneybags before units so that units show up in front

    if (displayCurrentPlayersUnits) {
        renderEntities(player.units, player.id);
    }

    for (var key in otherPlayers){
        if (otherPlayers.hasOwnProperty(key))
            renderEntities(otherPlayers[key].units, key);
    }

    renderEntities(player.buildings);

    for (var key in otherPlayers){
        if (otherPlayers.hasOwnProperty(key))
            renderEntities(otherPlayers[key].buildings, key);
    }

    if (buildMode.on) {
        renderBuildLocation();
    }
    renderIndicator();
    
    renderSelectionBox();
    //cameraPan(currentMousePosition);
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
