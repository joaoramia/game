function Building (pos, type, maxHealth, defense, socketId) {
	this.pos = pos;
	this.type = type;
	this.currentHealth = maxHealth;
	this.maxHealth = maxHealth;
	this.defense = defense;
	this.selected = false;
	this.sprite = null;
	this.socketId = socketId;
}

//we can change the name of this building
function Bar (pos, socketId) {
	Building.call(this, pos, 'bar', 1000, 5, socketId);
	this.cost = 2000;
}

module.exports = {
	Bar: Bar
}