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
// document.body.appendChild(canvas);

var viewCanvas = document.createElement('canvas');
var ctxV = viewCanvas.getContext('2d');
viewCanvas.width = 600;
viewCanvas.height = 500;
var vp = {
	pos: [0,0]
};
document.body.appendChild(viewCanvas);

function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        vp.pos[1] += 10;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        vp.pos[1] -= 10;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        vp.pos[0] -= 10;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        vp.pos[0] += 10;
    }
}
var image = document.getElementsByTagName('img')[0];
function drawViewport () {
	ctxV.drawImage(canvas, vp.pos[0], vp.pos[1], viewCanvas.width, viewCanvas.height, 0, 0, viewCanvas.width, viewCanvas.height);
}