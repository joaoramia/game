function Building (pos, type, maxHealth, defense, socketId, id) {
	this.pos = pos;
	this.type = type;
	this.currentHealth = maxHealth;
	this.maxHealth = maxHealth;
	this.defense = defense;
	this.selected = false;
	this.sprite = null;
	this.socketId = socketId;
	this.id = id;
}

function Bar (pos, socketId, id, tiles) {
	Building.call(this, pos, 'bar', 1000, 5, socketId, id);
	this.cost = 2000;
	this.productionQueue = [];
	this.currentlyBuilding = false;
	this.rendezvousPoint = null;
	this.tiles = tiles;
	this.progress = 60;
}

function House (pos, socketId, id, tiles) {
	Building.call(this, pos, 'house', 650, 5, socketId, id);
	this.cost = 1000;
	this.containedUnits = [];
	this.tiles = tiles;
}

module.exports = {
	Bar: Bar,
	House: House
}