var rect = {};
var drag = false;
var rightClick = {};
var positionOfNewBuilding;
var tileOfNewBuilding;
var moveIndicator;

var currentMousePosition;

function mouseDown(e) {
  if ( buildMode.on && (e.which === 1 && !e.ctrlKey) ) {
    var tempX = e.layerX + vp.pos[0];
    var tempY = e.layerY + vp.pos[1];
    positionOfNewBuilding = getPointFromTile(tileOfNewBuilding[0]);
    buildMouseLocation = undefined;
  } else if (rendezvousMode.on && (e.which === 1 && !e.ctrlKey)) {
    var tempX = e.layerX + vp.pos[0];
    var tempY = e.layerY + vp.pos[1];
    rendezvousMode.mostRecentRendezvous = [tempX, tempY];
  } else if (e.which === 1 && !e.ctrlKey) {
    rect.startX = e.layerX + vp.pos[0];
    rect.startY = e.layerY + vp.pos[1];
    rect.w = 5;
    rect.h = 5;
    drag = true;
  } else if ( (e.ctrlKey && currentSelection.length) || (e.which === 3 && currentSelection.length) ) {
    rightClick.x = e.layerX + vp.pos[0];
    rightClick.y = e.layerY + vp.pos[1];
    mouseTargetLocation[0] = Math.floor(rightClick.x/tileWidth); //#a-star algorithm
    mouseTargetLocation[1] = Math.floor(rightClick.y/tileHeight); //#a-star algorithm
  }
}

function mouseUp(e) {
  if (buildMode.on) {
    submitBuildingLocation(positionOfNewBuilding, buildMode.type);
    buildModeOff();
  } else if (rendezvousMode.on) {
    submitRendezvousPosition(rendezvousMode.mostRecentRendezvous);
  } else if (attackPending && e.which === 1) { // Attack functionality ('on a-click')
    handleAttackInput(e.layerX + vp.pos[0], e.layerY + vp.pos[1]); // takes in the x and y corresponding to the big canvas
  } else if (e.which === 1 && !e.ctrlKey){ // Regular Click
    select();
  }
  else {
    var counter = 0; //this is where the selected units will not stack on the top of each other
    for (var unitId in player.units) {
      var unit = player.units[unitId];

      if (unit.sprite.selected) {
        
        unit.vigilant = false;
        unit.hit = false;
        unit.targetpos = findPath(world, getTileFromPoint(unit.pos, unit.sprite.type), getTileFromPoint([rightClick.x + counter, rightClick.y + counter], unit.sprite.type));
        unit.targetpos.shift(); //this is because the first path tile is the current tile the unit is on
        unit.finalpos = [rightClick.x + counter, rightClick.y + counter];
        counter += tileWidth/2;
      }
    }
  }
  drag = false;
  rect = {};
  displayRootMenu(); //defined in js/ui/main-menu.js
}

function mouseMove(e) {
  if (drag) {
    rect.w = e.layerX + vp.pos[0] - rect.startX;
    rect.h = e.layerY + vp.pos[1] - rect.startY;
  }

  currentMousePosition = e;

  if (buildMode.on){
    buildPositioner(e);
  }
  
  // for scrolling without clicking
  // diagonal movement check
}

function select(){
  $("#building-info-panel").hide();
  currentSelection = [];
  var unitFound = false;


  var rectEndX = rect.startX + rect.w;
  var rectEndY = rect.startY + rect.h;

  for (var unitId in player.units) {
    var unit = player.units[unitId];
    unit.sprite.selected = false;
    var playerEndX = unit.pos[0] + unit.sprite.size[0];
    var playerEndY = unit.pos[1] + unit.sprite.size[1];

    if (inRange(unit.pos[0], playerEndX, rect.startX, rectEndX) && inRange(unit.pos[1], playerEndY, rect.startY, rectEndY)){
      currentSelection.push(unit);
      unit.sprite.selected = true;
      unitFound = true;
    }
  }

  if (!unitFound){
    for (var buildingId in player.buildings) {
      var aBuilding = player.buildings[buildingId];
      aBuilding.sprite.selected = false;
      var buildingEndX = aBuilding.pos[0] + aBuilding.sprite.size[0];
      var buildingEndY = aBuilding.pos[1] + aBuilding.sprite.size[1];
      if ( (inRange(aBuilding.pos[0], buildingEndX, rect.startX, rectEndX) 
                          && inRange(aBuilding.pos[1], buildingEndY, rect.startY, rectEndY)) ) {
        aBuilding.sprite.selected = true;
        currentSelection.push(aBuilding);
        lastSelectedBuilding = aBuilding;
      }
    }
  }


  rightClick = {};
  drag = false;

}

function renderIndicator () {
  currentSelection.forEach(function (unit) {
    if (unit.finalpos) {
      ctx.beginPath();
      ctx.ellipse(unit.finalpos[0], unit.finalpos[1], 20, 10, 0, 0, Math.PI*2);
      ctx.strokeStyle = (unit.vigilant? 'rgba(255, 0, 0, 1)' : 'rgba(0, 255, 0, 0.7)');
      ctx.closePath();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(unit.pos[0] + unit.sprite.size[0] / 2, unit.pos[1] + unit.sprite.size[1]);
      ctx.lineTo(unit.finalpos[0], unit.finalpos[1]);
      ctx.strokeStyle = (unit.vigilant? 'rgba(255, 0, 0, 1)' : 'rgba(0, 255, 0, 0.4)');
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.ellipse(unit.finalpos[0], unit.finalpos[1], 2, 1, 0, 0, Math.PI*2);
      ctx.closePath();
      ctx.fill();
    }
  });
}