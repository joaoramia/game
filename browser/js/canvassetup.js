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
canvas.width = 1500; //Remember to adjust the back end size any time this changes
canvas.height = 1000; //Remember to adjust the back end size any time this changes

var viewCanvas = document.createElement('canvas');
var ctxV = viewCanvas.getContext('2d');
  viewCanvas.width = window.innerWidth;
  viewCanvas.height = window.innerHeight;
var vp = {
	pos: [0, 0]
};

//append canvas to the DOM
$("#game-ui").prepend(viewCanvas);

function handleInput(dt) {
    if(input.isDown('DOWN')) {
        if (vp.pos[1] < canvas.height - viewCanvas.height - 10) {
            vp.pos[1] += 10;
        }
    }

    if(input.isDown('UP')) {
        if (vp.pos[1] > 10) {
            vp.pos[1] -= 10;
        }
    }

    if(input.isDown('LEFT')) {
        if (vp.pos[0] > 10) {
            vp.pos[0] -= 10;
        }
    }

    if(input.isDown('RIGHT')) {
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
      vp.pos[0] -= 10;
    } else if (xMaxLimit(e)) {
      vp.pos[0] += 10;
    } else if (yMinLimit(e)) {
      vp.pos[1] -= 10;
    } else if (yMaxLimit(e)) {
      vp.pos[1] += 10;
    }
}

function drawViewport () {
    ctxV.drawImage(canvas, vp.pos[0], vp.pos[1], viewCanvas.width, viewCanvas.height, 0, 0, viewCanvas.width, viewCanvas.height);
}

function adjustVPOnGameReady (location) {

    if (location[0] - viewCanvas.width/2 < 0 && location[1] - viewCanvas.height/2 < 0) {
      vp.pos[0] = 0;
      vp.pos[1] = 0;
      return;
    }
    else if (location[1] - viewCanvas.height/2 < 0 && location[0] + viewCanvas.width/2 > canvas.width) {
      vp.pos[1] = 0;
      vp.pos[0] = canvas.width - viewCanvas.width;
      return;
    }
    else if (location[0] - viewCanvas.width/2 < 0 && location[1] + viewCanvas.height/2 > canvas.height){
      vp.pos[0] = 0;
      vp.pos[1] = canvas.height - viewCanvas.height;
      return;
    }
    else if (location[0] + viewCanvas.width/2 > canvas.width && location[1] + viewCanvas.height/2 > canvas.height) {
      vp.pos[0] = canvas.width - viewCanvas.width;
      vp.pos[1] = canvas.height - viewCanvas.height;
      return;
    }
    else if (location[0] - viewCanvas.width/2 < 0) {
      vp.pos[0] = 0;
      vp.pos[1] = location[1] - viewCanvas.height/2;
      return;
    }
    else if (location[1] - viewCanvas.height/2 < 0) {
      vp.pos[1] = 0;
      vp.pos[0] = location[0] - viewCanvas.width/2;
      return;
    }
    else if (location[1] + viewCanvas.height/2 > canvas.height){
      vp.pos[1] = canvas.height - viewCanvas.height;
      vp.pos[0] = location[0] - viewCanvas.width/2;
      return;
    }
    else if (location[0] + viewCanvas.width/2 > canvas.width) {
      vp.pos[0] = canvas.width - viewCanvas.width;
      vp.pos[1] = location[1] - viewCanvas.height/2;
      return;
    }
    vp.pos[0] = location[0] - viewCanvas.width/2;
    vp.pos[1] = location[1] - viewCanvas.height/2;
}
