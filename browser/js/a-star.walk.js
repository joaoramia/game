function walk(dt){
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        if (unit.targetpos && unit.targetpos.length){
            var nextPoint = getPointFromTile(unit.targetpos[0]);
            if (unit.targetpos.length === 1 && unit.finalpos) nextPoint = unit.finalpos;
            prepForCombat(unit); // for changing their range radius on R tree

            if (Math.abs(unit.pos[0] - nextPoint[0]) >= 5 || Math.abs(unit.pos[1] - nextPoint[1]) >= 5){
                var distance = unit.speed*dt;
                if (unit.type === 'hero' && player.id === currentKing){
                    unit.sprite._index += 0.25;
                    if(Math.abs(unit.pos[1] - nextPoint[1]) >= 5){
                        if ((unit.pos[1] - nextPoint[1]) <= 5){
                            //down
                            unit.sprite.pos = [0, 0];
                            unit.pos[1] += distance;
                        }
                        if ((unit.pos[1] - nextPoint[1]) > 5){
                            //up
                            unit.sprite.pos = [0, 155];
                            unit.pos[1] -= distance;
                        }
                    }
                    if(Math.abs(unit.pos[0] - nextPoint[0]) >= 5){
                        if ((unit.pos[0] - nextPoint[0]) <= 5){
                            //right
                            unit.sprite.pos = [0, 105];
                            unit.pos[0] += distance;
                        }
                        if ((unit.pos[0] - nextPoint[0]) > 5){
                            //left
                            unit.sprite.pos = [0, 53];
                            unit.pos[0] -= distance;
                        }
                    }
                }
                if (unit.type === 'hero' && player.id !== currentKing){
                    unit.sprite._index += 0.25;
                    if(Math.abs(unit.pos[1] - nextPoint[1]) >= 5){
                        if ((unit.pos[1] - nextPoint[1] < 0)){
                            //down
                            unit.sprite.url = 'img/hero/hero-2.png';
                            unit.pos[1] += distance;
                        }
                        if ((unit.pos[1] - nextPoint[1] > 0)){
                            //up
                            unit.sprite.url = 'img/hero/hero-0.png';
                            unit.pos[1] -= distance;
                        }
                    }
                    if(Math.abs(unit.pos[0] - nextPoint[0]) >= 5){
                        if ((unit.pos[0] - nextPoint[0] < 0)){
                            //right
                            unit.sprite.url = 'img/hero/hero-1.png';
                            unit.pos[0] += distance;
                        }
                        if ((unit.pos[0] - nextPoint[0] > 0)){
                            //left
                            unit.sprite.url = 'img/hero/hero-3.png';
                            unit.pos[0] -= distance;
                        }
                    }
                }
                if (unit.type === 'soldier'){
                    unit.sprite._index += 0.25;
                    if(Math.abs(unit.pos[1] - nextPoint[1]) >= 5){
                        if ((unit.pos[1] - nextPoint[1] < 0)){
                            //down
                            unit.pos[1] += distance;
                        }
                        if ((unit.pos[1] - nextPoint[1] > 0)){
                            //up
                            unit.pos[1] -= distance;
                        }
                    }
                    if(Math.abs(unit.pos[0] - nextPoint[0]) >= 5){
                        if ((unit.pos[0] - nextPoint[0] < 0)){
                            //right
                            unit.sprite.pos = [0, 0];
                            unit.pos[0] += distance;
                        }
                        if ((unit.pos[0] - nextPoint[0] > 0)){
                            //left
                            unit.sprite.pos = [0, 64];
                            unit.pos[0] -= distance;
                        }
                    }
                }
            }
            else {
                unit.targetpos.shift();
            }
        }
        else {
            unit.finalpos = undefined;
        }
	}
}


