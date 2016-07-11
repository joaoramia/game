//The below methods are created in order to show the possible building positions on the canvas -----------------------

var buildMouseLocation;

var spriteSizes = {
    "hero": [34, 50],
    "soldier": [64, 64],
    "moneybag": [33, 36],
    "bar": [320, 288],
    "house": [96, 160],
    "hero_soldier": [108, 114] //this is for the random location function to put soldiers 10 pixels next to heros
}

function getMousePos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return [e.layerX + vp.pos[0], e.layerY + vp.pos[1]];
}

function buildPositioner(e){
	buildMouseLocation = getMousePos(canvas, e);
}

function renderBuildLocation(){
	if (buildMouseLocation){
		var imageObj = resources.get('img/' + buildMode.type + '-asset.png');
		console.log(buildMouseLocation);
		tileOfNewBuilding = buildingTiles([buildMouseLocation[0],buildMouseLocation[1]], buildMode.type);
		console.log(tileOfNewBuilding);
		var pos = getPointFromTile(tileOfNewBuilding[0]);
		if (buildCollisions(pos, buildMode.type))forbiddenRange(pos[0], pos[1], imageObj.width, imageObj.height);
		ctx.globalAlpha = 0.3;
		ctx.drawImage(imageObj, pos[0], pos[1]);
		ctx.globalAlpha = 1;
	}
}

function forbiddenRange(x, y, w, h){
	ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.fillRect(x, y, w, h);
}


//Same function in index.js
function buildCollisions (position, type){
    var collision = false;

    for (var id in otherPlayers){
        for (var unit in otherPlayers[id].units){
            if (inRange(otherPlayers[id].units[unit].pos[0], otherPlayers[id].units[unit].pos[0] + spriteSizes[otherPlayers[id].units[unit].type][0], position[0], position[0] + spriteSizes[type][0])
                && inRange(otherPlayers[id].units[unit].pos[1], otherPlayers[id].units[unit].pos[1] + spriteSizes[otherPlayers[id].units[unit].type][1], position[1], position[1] + spriteSizes[type][1])){
                collision = true;
            }
        }
        for (var building in otherPlayers[id].buildings){
            if (inRange(otherPlayers[id].buildings[building].pos[0], otherPlayers[id].buildings[building].pos[0] + spriteSizes[otherPlayers[id].buildings[building].type][0], position[0], position[0] + spriteSizes[type][0]) && inRange(otherPlayers[id].buildings[building].pos[1], otherPlayers[id].buildings[building].pos[1] + spriteSizes[otherPlayers[id].buildings[building].type][1], position[1], position[1] + spriteSizes[type][1])){
                collision = true;
            }
        }
    }
 //    console.log(player);
    if (player.units){
	    for (var unit in player.units){
	        if (inRange(player.units[unit].pos[0], player.units[unit].pos[0] + spriteSizes[player.units[unit].type][0], position[0], position[0] + spriteSizes[type][0])
	            && inRange(player.units[unit].pos[1], player.units[unit].pos[1] + spriteSizes[player.units[unit].type][1], position[1], position[1] + spriteSizes[type][1])){
	            collision = true;
	        }
	    }
	}
	if (player.buildings){
	    for (var building in player.buildings){
	        if (inRange(player.buildings[building].pos[0], player.buildings[building].pos[0] + spriteSizes[player.buildings[building].type][0], position[0], position[0] + spriteSizes[type][0]) && inRange(player.buildings[building].pos[1], player.buildings[building].pos[1] + spriteSizes[player.buildings[building].type][1], position[1], position[1] + spriteSizes[type][1])){
	            collision = true;
	        }
	    }    	
    }

    return collision;
}