function Player(id, userName) {
  this.id = id; // socket.id
  this.userName = userName || "";
  this.numberOfSessions = 0;
  this.wealth = 20000;
  this.units = {}; // obj of Unit objects
  this.unitNumber = 0;
  this.buildings = {}; // obj of building objects
  this.buildingNumber = 0;
  this.isKing = false;
  this.absoluteMaxSupply = 50;
  this.currentMaxSupply = 10;
  //create a prototype that calculates current supply 
  this.currentSupply = 2;
}

module.exports = Player;