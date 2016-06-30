function walk(x, y, dt){
    currentSelection.forEach(function(unit, index){
        //test case for only allowing cap guys to walk (so when we select buildings it doesnt work)
        // if (unit.type === 'hero'){
        if (Math.abs(unit.pos[0] - x) > 5 || Math.abs(unit.pos[1] - y) > 5){

			if (unit.pos[0] < x) unit.pos[0] += unit.speed*dt;
			if (unit.pos[0] > x) unit.pos[0] -= unit.speed*dt;
			if (unit.pos[1] < y) unit.pos[1] += unit.speed*dt;
			if (unit.pos[1] > y) unit.pos[1] -= unit.speed*dt;
            if (unit.type === 'hero'){
                unit.sprite._index += 0.25;
            }
            if (unit.type === 'soldier'){
                unit.sprite._index += 0.25;
            }
        }
	})
}