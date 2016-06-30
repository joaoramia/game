function walk(x, y, dt){
    currentSelection.forEach(function(unit, index){
        //test case for only allowing cap guys to walk (so when we select buildings it doesnt work)
        if (unit.sprite.url === 'img/hero.png'){
            if (Math.abs(unit.pos[0] - x) > 5 || Math.abs(unit.pos[1] - y) > 5){

    			if (unit.pos[0] < x) unit.pos[0] += 50*dt;
    			if (unit.pos[0] > x) unit.pos[0] -= 50*dt;
    			if (unit.pos[1] < y) unit.pos[1] += 50*dt;
    			if (unit.pos[1] > y) unit.pos[1] -= 50*dt;

                unit.sprite._index += 0.25;
            }
		}
	})
}