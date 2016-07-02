function Building (pos, type, health, defense) {
	this.pos = pos;
	this.type = type;
	this.health = health;
	this.defense = defense;
	this.selected = false;
	this.sprite = null;
}

//we can change the name of this building
function Bar (pos) {
	Building.call(this, pos, 'barracks', 800, 5);
	this.cost = 2000;
}

module.exports = {
	Bar: Bar
}