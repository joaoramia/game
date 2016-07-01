function walk(dt){
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        if (unit.targetpos){
            if (Math.abs(unit.pos[0] - unit.targetpos[0]) > 5 || Math.abs(unit.pos[1] - unit.targetpos[1]) > 5){
    			if (unit.pos[0] < unit.targetpos[0]) unit.pos[0] += unit.speed*dt;
    			if (unit.pos[0] > unit.targetpos[0]) unit.pos[0] -= unit.speed*dt;
    			if (unit.pos[1] < unit.targetpos[1]) unit.pos[1] += unit.speed*dt;
    			if (unit.pos[1] > unit.targetpos[1]) unit.pos[1] -= unit.speed*dt;
                
                unit.sprite._index += 0.25;

                // if (unit.type === 'hero' && player.id === currentKing){
                //     if (unit.pos[0] < unit.targetpos[0]){
                //         // unit.sprite.pos = [0, 102];
                //         unit.pos[0] += unit.speed*dt;
                //     }
                //     if (unit.pos[0] > unit.targetpos[0]){
                //         // unit.sprite.pos = [0, 51];
                //         unit.pos[0] -= unit.speed*dt;  
                //     }
                //     if (unit.pos[1] < unit.targetpos[1]){
                //         // unit.sprite.pos = [0, 153];
                //         unit.pos[1] += unit.speed*dt;
                //     }
                //     if (unit.pos[1] > unit.targetpos[1]){
                //         // unit.sprite.pos = [0, 0];
                //         unit.pos[1] -= unit.speed*dt;  
                //     } 
                //     unit.sprite._index += 0.1;
                // }
                // if (unit.type === 'soldier'){
                //     unit.sprite._index += 0.25;
                // }
                // if (unit.type === 'hero' && player.id !== currentKing){
                //     unit.sprite._index += 0.25;
                // }
            }
            else {
                unit.targetpos = undefined;
            }
        }
	}
}