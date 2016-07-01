var rect = {};
var drag = false;
var rightClick = {};

var currentMousePosition;

function mouseDown(e) {

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
  if (attackPending && e.which === 1) { // Attack functionality ('on a-click')
    handleAttackInput(e.layerX + vp.pos[0], e.layerY + vp.pos[1]); // takes in the x and y corresponding to the big canvas
  } else if (e.which === 1 && !e.ctrlKey){ // Regular Click
    select();
  }
  else {
    for (var unitId in player.units) {
      var unit = player.units[unitId];
      if (unit.sprite.selected) unit.targetpos = [rightClick.x, rightClick.y];
    }
  }
  drag = false;
  rect = {};
  updateButtonMenuOnClick();
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

  for (var unitId in player.units) {
    var unit = player.units[unitId];
    unit.sprite.selected = false;
    var playerEndX = unit.pos[0] + vp.pos[0] + unit.sprite.size[0];
    var playerEndY = unit.pos[1] + vp.pos[1] + unit.sprite.size[1];

    if (inRange(unit.pos[0], playerEndX, rect.startX, rectEndX) && inRange(unit.pos[1], playerEndY, rect.startY, rectEndY)){
      currentSelection.push(unit);
      unit.sprite.selected = true;
    }
  }
  rightClick = {};
  drag = false;
}