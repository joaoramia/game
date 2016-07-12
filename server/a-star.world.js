module.exports = {
	createWorld: function (world, worldWidth, worldHeight){
		for (var w = 0; w < worldWidth; w++){
			world[w] = [];
			for (var h = 0; h < worldHeight; h++){
				world[w][h] = 0;
			}
		}
	},

	getTileFromPoint: function (point, type){
		var x = Math.round(point[0]/tileWidth);
		var y = Math.round(point[1]/tileHeight);
		return [x, y];
	},

	buildingTiles: function (location, type) {
		var buildingTilesHorizontal = Math.round(spriteSizes[type][0]/tileWidth);
		var buildingTilesVertical = Math.round(spriteSizes[type][1]/tileHeight);
		var result = [[Math.round(location[0]/tileWidth), Math.round(location[1]/tileHeight)]];
		for (var w = 0; w < buildingTilesHorizontal; w++){
			for (var h = 0; h < buildingTilesVertical; h++){
			    if (w === 0 && h === 0) continue;
			    result.push([result[0][0] + w, result[0][1] + h]);
			}
		}
		return result;
	},

	fillTilesOfBuilding: function (world, building){
		for (var x = 0; x < building.length; x++){
			world[building[x][0]][building[x][1]] = 1;
		}
	},

	removeTilesOfBuildings: function (world, buildings){
		for (var key in buildings){
			for (var x = 0; x < buildings[key].tiles.length; x++){
				world[buildings[key].tiles[x][0]][buildings[key].tiles[x][1]] = 0;
			}
		}
	}
}