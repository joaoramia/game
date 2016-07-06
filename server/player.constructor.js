function Player(id, username) {
	this.id = id; // socket.id
	this.username = username || "New player" + id;
	this.numberOfSessions = 0;
	this.wealth = 20000;
	this.units = {}; // obj of Unit objects
	this.unitNumber = 0;
	this.buildings = {}; // obj of building objects
	this.buildingNumber = 0;
	this.isKing = false;
	this.absoluteMaxSupply = 50;
}

Player.prototype.currentSupply = function() {
	var count = 0;
	for (unit in this.units) {
		if (this.units.hasOwnProperty(unit)) {
			count++;
		}
	}
	return count;
};

Player.prototype.currentMaxSupply = function() {
	var count = 10;
	for (building in this.buildings) {
		if (this.buildings.hasOwnProperty(building)) {
			if (this.buildings[building].type === "house") {
				count += 10;
				if (count >= this.absoluteMaxSupply) {
					return count;
				}
			}
		}
	}
	return count;
};

module.exports = Player;