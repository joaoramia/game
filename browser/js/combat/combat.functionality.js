function handleAttackInput (x, y) {
	var target = checkForTarget(x, y); // pass in location of click
    if (target) {
      setSingleTargetForCurrentSelection(target);
    } else {
      setVigilantAttackMove([x, y]);
    }
    attackPending = false;
}

function checkForTarget (x, y) { // loop through all units and see if any are in range of your click
	for (var otherPlayer in otherPlayers) {
		if (otherPlayers.hasOwnProperty(otherPlayer)){
			for (var unitId in otherPlayer.units) {
				var unit = otherPlayer.units[unitId];
				if (inRange(unit.pos[0], unit.sprite.size[0] + unit.pos[0], x, x + 5) && 
					inRange(unit.pos[1], unit.sprite.size[0], y, y + 5)) {
					unit.sprite.renderEllipse(true); // takes enemy? as argument for red ellipse
					return [unitId, otherPlayer]; // yes, sends two elements if otherPlayer
				}
			}
		}
	}
	// friendly fire 
	for (var unitId in player.units) {
		var unit = player.units[unitId];
		if (inRange(unit.pos[0], unit.sprite.size[0] + unit.pos[0], x, x + 5) && 
			inRange(unit.pos[1], unit.sprite.size[1] + unit.pos[1], y, y + 5)) {

			unit.sprite.renderEllipse(true); // takes enemy? as argument for red ellipse
			return [unitId]; // just sends back one element if you are a troll
		}
	}
	return null;
}

function setSingleTargetForCurrentSelection (target) {
  currentSelection.forEach(function (elem) {
    elem.targetUnit = (target.length < 2)? player.units[target[0]] : otherPlayers[target[1]].units[target[0]];
  });
}
// targetpos is an array with an x and y coordinate 
function setVigilantAttackMove (targetpos) {
  currentSelection.forEach(function (elem) {
    elem.vigilant = true;
    elem.targetpos = targetpos;
  });
}

