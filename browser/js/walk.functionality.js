function walk(dt){
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        if (unit.targetpos){
            if (Math.abs(unit.pos[0] - unit.targetpos[0]) > 5 || Math.abs(unit.pos[1] - unit.targetpos[1]) > 5){

                if (unit.type === 'hero' && player.id === currentKing){
                    if (unit.pos[1] - unit.targetpos[1] < -5){
                        //up
                        unit.sprite.pos = [0, 0];
                        unit.pos[1] += unit.speed*dt;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5){
                        //down
                        unit.sprite.pos = [0, 155];
                        unit.pos[1] -= unit.speed*dt;  
                    } 
                    if (unit.pos[0] - unit.targetpos[0] < -5){
                        //right
                        unit.sprite.pos = [0, 105];
                        unit.pos[0] += unit.speed*dt;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5){
                        //left
                        unit.sprite.pos = [0, 53];
                        unit.pos[0] -= unit.speed*dt;  
                    }
                    unit.sprite._index += 0.25;
                }
                if (unit.type === 'hero' && player.id !== currentKing){
                    if (unit.pos[1] - unit.targetpos[1] < -5){
                        //down
                        unit.sprite.url = 'img/hero/hero-2.png';
                        unit.pos[1] += unit.speed*dt;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5){
                        //up
                        unit.sprite.url = 'img/hero/hero-0.png';
                        unit.pos[1] -= unit.speed*dt;  
                    } 
                    if (unit.pos[0] - unit.targetpos[0] < -5){
                        //right
                        unit.sprite.url = 'img/hero/hero-1.png';
                        unit.pos[0] += unit.speed*dt;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5){
                        //left
                        unit.sprite.url = 'img/hero/hero-3.png';
                        unit.pos[0] -= unit.speed*dt;  
                    }
                    unit.sprite._index += 0.25;
                }
                if (unit.type === 'soldier'){
                    if (unit.pos[1] - unit.targetpos[1] < -5){
                        //up
                        // unit.sprite.pos = [0, 0];
                        unit.pos[1] += unit.speed*dt;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5){
                        //down
                        // unit.sprite.pos = [0, 155];
                        unit.pos[1] -= unit.speed*dt;  
                    } 
                    if (unit.pos[0] - unit.targetpos[0] < -5){
                        //right
                        unit.sprite.pos = [0, 0];
                        unit.pos[0] += unit.speed*dt;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5){
                        //left
                        unit.sprite.pos = [0, 64];
                        unit.pos[0] -= unit.speed*dt;  
                    }
                    unit.sprite._index += 0.25;
                }
            }
            else {
                unit.targetpos = undefined;
            }
        }
	}
}