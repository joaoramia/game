function walk(x, y, dt){
    currentSelection.forEach(function(unit, index){
        //test case for only allowing cap guys to walk (so when we select buildings it doesnt work)
        if (unit.sprite.url === 'img/capguy-walk.png'){
            if (Math.abs(unit.pos[0] - x) > 5 || Math.abs(unit.pos[1] - y) > 5){
                // console.log("X: ", x, "Y: ", y, "DT: ", dt, "UNIT POS X: ", unit.pos[0], "UNIT POS Y: ", unit.pos[1]);
    			if (unit.pos[0] < x) unit.pos[0] += 50*dt;
    			if (unit.pos[0] > x) unit.pos[0] -= 50*dt;
    			if (unit.pos[1] < y) unit.pos[1] += 50*dt;
    			if (unit.pos[1] > y) unit.pos[1] -= 50*dt;

                unit.sprite._index += 0.25;
            }
            unit.sprite.update();
		}
	})
}