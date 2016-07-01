function Unit (pos, type, maxHealth, attack, defense, speed, socketId) {
  this.pos = pos; // array of [x, y]
  this.type = type; //string
  this.selected = false;
  this.speed = speed;
  this.maxHealth = maxHealth; // integer
  this.attack = attack; // integer
  this.defense = defense; // integer
  this.sprite = null; // should be set on front-end
  this.targetpos = undefined;
  this.vigilant = false;
  this.socketId = socketId;
}

function Hero (socketId, pos, currentHealth){
  Unit.call(this, pos, 'hero', 100, 5, 1, 50, socketId);
  this.rateOfAttack = 1;
  this.currentHealth = currentHealth || this.maxHealth;
}

function Soldier (socketId, pos, currentHealth){
  Unit.call(this, pos, 'soldier', 60, 15, 0, 75, socketId);
  this.rateOfAttack = 5;
  this.currentHealth = currentHealth || this.maxHealth;
}

module.exports = {
  Unit : Unit,
  Hero: Hero,
  Soldier: Soldier
};