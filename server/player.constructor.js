function Player(id) {
  this.id = id; // socket.id
  this.units = []; // array of Unit objects
  this.buildings =[]; // array of building objects
}

module.exports = Player;