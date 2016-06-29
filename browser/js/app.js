var socket = io.connect('http://' + ip + ':3030');

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// The main game loop
var lastTime,
    birthTime;
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

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    reset();
    lastTime = Date.now();
    birthTime = Date.now();
    main();

    socket.emit('respawn', {});
    socket.emit('moneyBagsCoordsOnUserLogin', {});

    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);

}

resources.load([
    'img/sprites2.png',
    'img/capguy-walk.png',
    'img/terrain.png'
]);
resources.onReady(init);

// Game state
var moneyBags = {};

var player = {
    pos: [0, 0],
    sprite: new Sprite('img/capguy-walk.png', [0, 0], [184, 325], 16, [0, 1, 2, 3, 4, 5, 6, 7]),
    selected: false
}; 

var otherPlayers = [];

var currentSelection = [];

socket.on('otherPlayerJoin', function (otherPlayerData) {
    console.log(otherPlayerData.id + ' has joined!');
    otherPlayerData.sprite = new Sprite('img/capguy-walk.png', [0, 0], [184, 325], 16, [0, 1, 2, 3, 4, 5, 6, 7]);
    otherPlayers.push(otherPlayerData);
});

socket.on('moneyBagsUpdate', function (moneyBagsFromServer){
    moneyBags = moneyBagsFromServer;
    for (var moneyBag in moneyBags) {
        if (moneyBags.hasOwnProperty(moneyBag) && moneyBag !== "count") {
            var coords = moneyBag.split(",");
            coords[0] = parseInt(coords[0]);
            coords[1] = parseInt(coords[1]);
            moneyBags[moneyBag].pos = coords;
            moneyBags[moneyBag].sprite = new Sprite('img/moneybag.png', coords, 1, 1, [1]);
        }
    }
})

socket.on("gameReady", function(playerData) {
    player.id = playerData.id;
    player.pos = playerData.pos;
    // console.log(playerData, player.pos);
})

socket.on("playersArray", function(playersArray){
    otherPlayers = playersArray;
    otherPlayers.forEach(function(player){
        player.sprite = new Sprite('img/capguy-walk.png', [0, 0], [184, 325], 16, [0, 1, 2, 3, 4, 5, 6, 7]);
    });
    console.log(otherPlayers);
});

socket.on('otherPlayerDC', function (socketId) {
    var deletion = [];
    otherPlayers.forEach(function (player, index) {
        if (player.id === socketId) deletion.push(index);
    });
    deletion.forEach(function (index) {
        otherPlayers.splice(index, 1);
    });
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

    // handleInput(dt);

    updateEntities(dt);

    checkCollisions();

    scoreEl.innerHTML = score;

    socket.emit("playerMoves", player);

    socket.on("otherPlayerMoves", function(playerData) {
        otherPlayers.forEach(function(player){
            if (player.id === playerData.id) {
                player.pos = playerData.pos;
            }
        })
    })

};

// function handleInput(dt) {
//     if(input.isDown('DOWN') || input.isDown('s')) {
//         player.pos[1] += playerSpeed * dt;
//         player.sprite.update();
//     }

//     if(input.isDown('UP') || input.isDown('w')) {
//         player.pos[1] -= playerSpeed * dt;
//         player.sprite.update();
//     }

//     if(input.isDown('LEFT') || input.isDown('a')) {
//         ctx.scale(-1,1);
//         player.pos[0] -= playerSpeed * dt;
//         player.sprite.update();
//     }

//     if(input.isDown('RIGHT') || input.isDown('d')) {
//         player.pos[0] += playerSpeed * dt;
//         player.sprite.update();
//     }
// }

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    otherPlayers.forEach(function(player){
        player.sprite.update(dt);
    })

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

        switch(bullet.dir) {
        case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
        case 'down': bullet.pos[1] += bulletSpeed * dt; break;
        default:
            bullet.pos[0] += bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]/4) {
        player.pos[0] = canvas.width - player.sprite.size[0]/4;
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]/4) {
        player.pos[1] = canvas.height - player.sprite.size[1]/4;
    }
}

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
    }
    // console.log(otherPlayers);
    renderEntities(otherPlayers);

    renderSelectionBox();

    // renderEntities(moneyBags);
    // renderEntities(bullets);
    // renderEntities(enemies);
    // renderEntities(explosions);
};

function renderEntities(list) {
    if (Array.isArray(list)){
        for(var i=0; i<list.length; i++) {
            renderEntity(list[i]);
        }   
    } else if (typeof list === "object") {
        for (var item in list) {
            console.log(list[item]);
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

    // FOR TESTING:
    // var playerEndX = player.pos[0] + player.sprite.size[0]/4;
    // // var playerBegX = player.pos[0] - player.sprite.size[0]/8;
    // var playerEndY = player.pos[1] + player.sprite.size[1]/4;
    // // var playerBegY = player.pos[1] - player.sprite.size[1]/8;
      
    // var rectEndX = rect.startX + rect.w;
    // var rectEndY = rect.startY + rect.h;

    // ctx.fillRect(player.pos[0], player.pos[1], player.sprite.size[0]/4, player.sprite.size[1]/4);
    // ctx.fillStyle = "blue";
}

// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

// Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;

    enemies = [];
    bullets = [];

    player.pos = [50, canvas.height / 2];
};


