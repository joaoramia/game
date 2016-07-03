function Unit (pos, type, maxHealth, attack, defense, speed, socketId, unitId) {
  this.pos = pos; // array of [x, y]
  this.type = type; //string
  this.selected = false;
  this.speed = speed;
  this.maxHealth = maxHealth; // integer
  this.currentHealth = maxHealth;
  this.attack = attack; // integer
  this.defense = defense; // integer
  this.sprite = null; // should be set on front-end
  this.targetpos = undefined;
  this.vigilant = false;
  this.socketId = socketId;
  this.id = unitId;
}

function Hero (pos, socketId, unitId){
  Unit.call(this, pos, 'hero', 100, 5, 1, 50, socketId, unitId);
  this.rateOfAttack = 1;
}

function Soldier (pos, socketId, unitId){
  Unit.call(this, pos, 'soldier', 60, 15, 0, 75, socketId, unitId);
  this.rateOfAttack = 5;
}

module.exports = {
  Unit : Unit,
  Hero: Hero,
  Soldier: Soldier
};
