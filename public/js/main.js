var socket = io.connect('http://localhost:3030');

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
    sprite: new Sprite('img/capguy-walk.png', [0, 0], [184, 325], 16, [0, 1, 2, 3, 4, 5, 6, 7])
}; 

var otherPlayers = [];

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
    console.log(playerData, player.pos);
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

    handleInput(dt);
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

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
        player.sprite.update('down');
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
        player.sprite.update('up');
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        ctx.scale(-1,1);
        player.pos[0] -= playerSpeed * dt;
        player.sprite.update('left');
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        player.sprite.update('right');
    }
}

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
    renderEntities(moneyBags);
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



// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();
    
    // Run collision detection for all enemies and bullets
    // for(var i=0; i<enemies.length; i++) {
    //     var pos = enemies[i].pos;
    //     var size = enemies[i].sprite.size;

    //     for(var j=0; j<bullets.length; j++) {
    //         var pos2 = bullets[j].pos;
    //         var size2 = bullets[j].sprite.size;

    //         if(boxCollides(pos, size, pos2, size2)) {
    //             // Remove the enemy
    //             enemies.splice(i, 1);
    //             i--;

    //             // Add score
    //             score += 100;

    //             // Add an explosion
    //             explosions.push({
    //                 pos: pos,
    //                 sprite: new Sprite('img/sprites.png',
    //                                    [0, 117],
    //                                    [39, 39],
    //                                    16,
    //                                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //                                    null,
    //                                    true)
    //             });

    //             // Remove the bullet and stop this iteration
    //             bullets.splice(j, 1);
    //             break;
    //         }
    //     }

    //     if(boxCollides(pos, size, player.pos, player.sprite.size)) {
    //         gameOver();
    //     }
    // }
}

(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();

(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;
                
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

(function() {
    function Sprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
    };

    Sprite.prototype = {

        update: function(direction) {
            // this._index += this.;
            if (direction === 'right'){
                this._index += 0.5;
            }
            if (direction === 'left'){
                ctx.scale(-1, 1);
                this._index += 0.5;
            }
        },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0]/4, this.size[1]/4);
        }
    };

    window.Sprite = Sprite;
})();