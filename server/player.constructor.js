function Player(id, userName) {
  this.id = id; // socket.id
  this.userName = userName || "";
  this.numberOfSessions = 0;
  this.wealth = 200;
  this.units = []; // array of Unit objects
  this.buildings =[]; // array of building objects
}

module.exports = Player;