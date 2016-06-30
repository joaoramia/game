var rect = {};
var drag = false;
var rightClick = {};

var currentMousePosition;

function mouseDown(e) {
  console.log("pageX: ", e.pageX, "pageY: ", e.pageY);
  console.log("layerX: ", e.layerX, "layerY: ", e.layerY);
  console.log("VP POS: ", vp.pos);

  if (e.which === 1 && !e.ctrlKey){
    rect.startX = e.layerX + vp.pos[0];
    rect.startY = e.layerY + vp.pos[1];
    rect.w = 5;
    rect.h = 5;
    drag = true;
  }
  else if ( (e.ctrlKey && currentSelection.length) || (e.which === 3 && currentSelection.length) ) {
    rightClick.x = e.layerX + vp.pos[0];
    rightClick.y = e.layerY + vp.pos[1];
  }
}

function mouseUp(e) {
  if (e.which === 1 && !e.ctrlKey){
    select();
  }
  else {
    player.units.forEach(function(unit){
      if (unit.sprite.selected) unit.targetpos = [rightClick.x, rightClick.y];
    })
  }
  drag = false;
  rect = {};
}

function mouseMove(e) {
  if (drag) {
    rect.w = e.layerX + vp.pos[0] - rect.startX;
    rect.h = e.layerY + vp.pos[1] - rect.startY ;
  }

  currentMousePosition = e;
  // for scrolling without clicking
  // diagonal movement check
}

//May still require adjustments, but seems to be able to accomodate multi-unit selection
function select(){
  currentSelection = [];

  var rectEndX = rect.startX + rect.w;
  var rectEndY = rect.startY + rect.h;

  player.units.forEach(function(unit) {
    unit.sprite.selected = false;
    var playerEndX = unit.pos[0] + vp.pos[0] + unit.sprite.size[0];
    var playerEndY = unit.pos[1] + vp.pos[1] + unit.sprite.size[1];

    if (inRange(unit.pos[0], playerEndX, rect.startX, rectEndX) && inRange(unit.pos[1], playerEndY, rect.startY, rectEndY)){
      currentSelection.push(unit);
      unit.sprite.selected = true;
    }
  })

  rigtClick = {};
  drag = false;
}