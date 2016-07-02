function Player(id, userName) {
  this.id = id; // socket.id
  this.userName = userName || "";
  this.numberOfSessions = 0;
  this.wealth = 2000;
  this.units = {}; // obj of Unit objects
  this.unitNumber = 0;
  this.buildings = {}; // obj of building objects
  this.buildingNumber = 0;
  this.isKing = false;
}

module.exports = Player;