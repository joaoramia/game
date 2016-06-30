function Unit (pos, type, health, attack, defense, speed) {
  this.pos = pos; // array of [x, y]
  this.type = type; //string
  this.selected = false;
  this.speed = speed;
  this.health = health; // integer
  this.attack = attack; // integer
  this.defense = defense; // integer
  this.sprite = null; // should be set on front-end
}

function Hero (pos){
  Unit.call(this, pos, 'hero', 100, 5, 1, 50);
  this.rateOfAttack = 1;
}

function Soldier (pos){
  Unit.call(this, pos, 'soldier', 60, 15, 0, 75);
  this.rateOfAttack = 5;
}

module.exports = {
  Unit : Unit,
  Hero: Hero,
  Soldier: Soldier
};