var explosions = [];

function explosionUpdate () {
	this._index += 0.25;
}

function processExplosions () {
	for(var i=0; i<explosions.length; i++) {
	    explosionUpdate.call(explosions[i].sprite);

	    // Remove if animation is done
	    if(explosions[i].sprite._index >= 4) {
	        explosions.splice(i, 1);
	        i--;
	    }
	}
}

function createExplosion (pos) {
	var newExplosion = {
		pos: [pos[0] + 10, pos[1] + 25],
		type: 'explosion'
	};
	newExplosion.sprite = generateSprite(newExplosion.type, false);
	explosions.push(newExplosion);
}




