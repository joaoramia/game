var Utils = require('./utils.js');

function Player(id, username) {
	this.id = id; // socket.id
	this.username = username || randomName();
	this.numberOfSessions = 0;
	this.wealth = 2000;
	this.units = {}; // obj of Unit objects
	this.unitNumber = 0;
	this.buildings = {}; // obj of building objects
	this.buildingNumber = 1;
	this.isKing = false;
	this.absoluteMaxSupply = 50;
	this.score = 2000; //make this equal to wealth
}

function randomName(){
	var names = ['Billy Elliot', 'Bennedict', 'Franklin', 'Joseph', 'OmriBear', 'Jansenski', 'Batter']
	return names[Utils.getRandomNum(names.length -1)];
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