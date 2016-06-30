var rect = {};
var drag = false;
var rightClick = {};

var currentMousePosition;

function mouseDown(e) {
  console.log(e.which);
  console.log("CTRL", e.ctrlKey);
  if (e.which === 1 && !e.ctrlKey){
    rect.startX = e.pageX - this.offsetLeft;
    rect.startY = e.pageY - this.offsetTop;
    rect.w = 5;
    rect.h = 5;
    drag = true;
  }
  else if ( (e.ctrlKey && currentSelection.length) || (e.which === 3 && currentSelection.length) ) {
    rightClick.x = e.layerX;
    rightClick.y = e.layerY;
  }
}

function mouseUp(e) {
  if (e.which === 1 && !e.ctrlKey){
    select();
  }
  drag = false;
  rect = {};
}

function mouseMove(e) {
  if (drag) {
    rect.w = (e.pageX - this.offsetLeft) - rect.startX;
    rect.h = (e.pageY - this.offsetTop) - rect.startY ;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
  }

  currentMousePosition = e;
  // for scrolling without clicking
  // diagonal movement check
}

function draw() {
  ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
  ctx.fillStyle = "red";
}

//TO BE REFORMATTED ONCE BUILDING AND OTHER UNITS ARE MADE
function select(){
    currentSelection = [];

    var rectEndX = rect.startX + rect.w;
    var rectEndY = rect.startY + rect.h;

    player.units.forEach(function(unit) {
      var playerEndX = unit.pos[0] + unit.sprite.size[0];
      var playerEndY = unit.pos[1] + unit.sprite.size[1];

      if (inRange(unit.pos[0], playerEndX, rect.startX, rectEndX) && inRange(unit.pos[1], playerEndY, rect.startY, rectEndY)){
        currentSelection.push(unit);
        unit.sprite.selected = true;
        console.log("SPRITE PROPERTY SELECTED: ", unit.sprite.selected)
        console.log("SELECTED: ", currentSelection);
      }
    })

    ////  


}