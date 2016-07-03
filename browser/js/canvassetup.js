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
canvas.width = 2500;
canvas.height = 1000;

var viewCanvas = document.createElement('canvas');
var ctxV = viewCanvas.getContext('2d');
  viewCanvas.width = window.innerWidth;
  viewCanvas.height = window.innerHeight;
var vp = {
	pos: [0,0]
};

//append canvas to the DOM
$("#game-view").append(viewCanvas);

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        if (vp.pos[1] < canvas.height - viewCanvas.height - 10) {
            vp.pos[1] += 10;
        }
    }

    if(input.isDown('UP') || input.isDown('w')) {
        if (vp.pos[1] > 10) {
            vp.pos[1] -= 10;
        }
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        if (vp.pos[0] > 10) {
            vp.pos[0] -= 10;
        }
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        if (vp.pos[0] < canvas.width - viewCanvas.width - 10) {
            vp.pos[0] += 10;
        }
    }
}

function cameraPan (e) {
    if (!e) return;
    if (xMinLimit(e) && yMinLimit(e)) {
      vp.pos[0] -= 10;
      vp.pos[1] -= 10;
    } else if (xMaxLimit(e) && yMinLimit(e)) {
      vp.pos[0] += 10;
      vp.pos[1] -= 10;
    } else if (xMinLimit(e) && yMaxLimit(e)) {
      vp.pos[0] -= 10;
      vp.pos[1] += 10;
    } else if (xMaxLimit(e) && yMaxLimit(e)) {
      vp.pos[0] += 10;
      vp.pos[1] += 10;
    } else if (xMinLimit(e)) {
      vp.pos[0] -= 15;
    } else if (xMaxLimit(e)) {
      vp.pos[0] += 15;
    } else if (yMinLimit(e)) {
      vp.pos[1] -= 15;
    } else if (yMaxLimit(e)) {
      vp.pos[1] += 15;
    }
}

function drawViewport () {
	ctxV.drawImage(canvas, vp.pos[0], vp.pos[1], viewCanvas.width, viewCanvas.height, 0, 0, viewCanvas.width, viewCanvas.height);
}