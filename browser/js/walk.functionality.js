function walk(dt){
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        if (unit.targetpos){
            if (Math.abs(unit.pos[0] - unit.targetpos[0]) > 5 || Math.abs(unit.pos[1] - unit.targetpos[1]) > 5){
                var distance = unit.speed*dt;
                if (unit.type === 'hero' && player.id === currentKing){
                    unit.sprite._index += 0.25;
                    switch(detectBuildings(unit, dt)){
                        case 'down':
                        unit.sprite.pos = [0, 0];
                        unit.pos[1] += distance;
                        unit.lastMovement.dir2 = 'down';
                        return;

                        case 'up':
                        unit.sprite.pos = [0, 155];
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir2 = 'up';
                        return;
                        
                        case 'right':
                        unit.sprite.pos = [0, 105];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir2 = 'right';
                        return;
                        
                        case 'left':
                        unit.sprite.pos = [0, 53];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir2 = 'left';
                        return;
                    }

                    if ((unit.pos[1] - unit.targetpos[1] < -5) && unit.lastMovement.dir2 !== 'up'){
                        //down
                        unit.sprite.pos = [0, 0];
                        unit.pos[1] += distance;
                        unit.lastMovement.dir1 = 'down';
                        return;
                    }
                    if ((unit.pos[1] - unit.targetpos[1] > 5) && unit.lastMovement.dir2 !== 'down'){
                        //up
                        unit.sprite.pos = [0, 155];
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir1 = 'up';
                        return;
                    }
                    if ((unit.pos[0] - unit.targetpos[0] < -5) && unit.lastMovement.dir2 !== 'left'){
                        //right
                        unit.sprite.pos = [0, 105];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir1 = 'right';
                        return;
                    }
                    if ((unit.pos[0] - unit.targetpos[0] > 5) && unit.lastMovement.dir2 !== 'right'){
                        //left
                        unit.sprite.pos = [0, 53];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir1 = 'left';
                        return;
                    }
                }



                if (unit.type === 'hero' && player.id !== currentKing){
                    unit.sprite._index += 0.25;
                    switch(detectBuildings(unit, dt)){
                        case 'down':
                        unit.sprite.url = 'img/hero/hero-2.png';
                        unit.pos[1] += distance;
                        unit.lastMovement.dir2 = 'down';
                        return;

                        case 'up':
                        unit.sprite.url = 'img/hero/hero-0.png';
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir2 = 'up';
                        return;
                        
                        case 'right':
                        unit.sprite.url = 'img/hero/hero-1.png';
                        unit.pos[0] += distance;
                        unit.lastMovement.dir2 = 'right';
                        return;
                        
                        case 'left':
                        unit.sprite.url = 'img/hero/hero-3.png';
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir2 = 'left';
                        return;
                    }

                    if (unit.pos[1] - unit.targetpos[1] < -5){
                        //down
                        unit.sprite.url = 'img/hero/hero-2.png';
                        unit.pos[1] += distance;
                        unit.lastMovement.dir1 = 'down';
                        return;
                    }
                    if (unit.pos[0] - unit.targetpos[0] < -5){
                        //right
                        unit.sprite.url = 'img/hero/hero-1.png';
                        unit.pos[0] += distance;
                        unit.lastMovement.dir1 = 'right';
                        return;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5){
                        //up
                        unit.sprite.url = 'img/hero/hero-0.png';
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir1 = 'up';
                        return;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5){
                        //left
                        unit.sprite.url = 'img/hero/hero-3.png';
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir1 = 'left';
                        return;
                    }
                }



                if (unit.type === 'soldier'){
                    unit.sprite._index += 0.25;
                    switch(detectBuildings(unit, dt)){
                        case 'down':
                        unit.pos[1] += distance;
                        unit.lastMovement.dir2 = 'down';
                        return;

                        case 'up':
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir2 = 'up';
                        return;
                        
                        case 'right':
                        unit.sprite.pos = [0, 0];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir2 = 'right';
                        return;
                        
                        case 'left':
                        unit.sprite.pos = [0, 64];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir2 = 'left';
                        return;
                    }

                    if (unit.pos[1] - unit.targetpos[1] < -5){
                        //down
                        unit.pos[1] += distance;
                        unit.lastMovement.dir1 = 'down';
                        return;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5){
                        //up
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir1 = 'up';
                        return;
                    }
                    if (unit.pos[0] - unit.targetpos[0] < -5){
                        //right
                        unit.sprite.pos = [0, 0];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir1 = 'right';
                        return;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5){
                        //left
                        unit.sprite.pos = [0, 64];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir1 = 'left';
                        return;
                    }
                }
            }
            else {
                unit.targetpos = undefined;
            }
        }
        unit.lastMovement.dir2 = undefined;
	}
}

function detectBuildings (unit, dt){
    var unitEndX = unit.pos[0] + unit.sprite.size[0];
    var unitEndY = unit.pos[1] + unit.sprite.size[1];
    for (var id in player.buildings){
        var buildingEndX = player.buildings[id].pos[0] + player.buildings[id].sprite.size[0];
        var buildingEndY = player.buildings[id].pos[1] + player.buildings[id].sprite.size[1];
        
        if (inRange(unit.pos[0], unitEndX, player.buildings[id].pos[0], buildingEndX) && inRange(unit.pos[1], unitEndY, player.buildings[id].pos[1], buildingEndY)){
            
            if (unit.lastMovement.dir1 === 'left' || unit.lastMovement.dir1 === 'right'){
                if ((unit.pos[1] + unit.sprite.size[1]/2 - player.buildings[id].pos[1] + 50) > (buildingEndY - unit.pos[1] + unit.sprite.size[1]/2)){
                    return 'down';
                }
                else {
                    return 'up';
                }
            }
            
            else {
                if ((unit.pos[0] + unit.sprite.size[0]/2 - player.buildings[id].pos[0]) > (buildingEndX -unit.pos[0] + unit.sprite.size[0]/2)){
                    return 'right';
                }
                else {
                    return 'left';
                }
            }
        }
    }
    return false;
}