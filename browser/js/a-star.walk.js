function walk(dt){
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        if (unit.targetpos && unit.targetpos.length){
            var nextPoint = getPointFromTile(unit.targetpos[0]);
            prepForCombat(unit); // for changing their range radius on R tree

            if (Math.abs(unit.pos[0] - nextPoint[0]) > tileWidth/2 || Math.abs(unit.pos[1] - nextPoint[1]) > tileHeight/2){
                var distance = unit.speed*dt;
                if (unit.type === 'hero' && player.id === currentKing){
                    unit.sprite._index += 0.25;
                    if ((unit.pos[1] - nextPoint[1] < 0)){
                        //down
                        unit.sprite.pos = [0, 0];
                        unit.pos[1] += distance;
                        // continue;
                    }
                    if ((unit.pos[1] - nextPoint[1] > 0)){
                        //up
                        unit.sprite.pos = [0, 155];
                        unit.pos[1] -= distance;
                        // continue;
                    }
                    if ((unit.pos[0] - nextPoint[0] < 0)){
                        //right
                        unit.sprite.pos = [0, 105];
                        unit.pos[0] += distance;
                        // continue;
                    }
                    if ((unit.pos[0] - nextPoint[0] > 0)){
                        //left
                        unit.sprite.pos = [0, 53];
                        unit.pos[0] -= distance;
                        // continue;
                    }
                }
            }
            else {
                unit.targetpos.shift();
            }
        }
	}
}


