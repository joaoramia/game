function checkCollisionWithMoneyBag() {
  for (var moneyBag in moneyBags) {
    var moneyPos = moneyBags[moneyBag].pos;
    var moneySize = moneyBags[moneyBag].sprite.size;

    player.units.forEach(function(unit){
        //console.log(unit.sprite.pos);
        if (boxCollides(unit.pos, unit.sprite.size, moneyBags[moneyBag].pos, moneyBags[moneyBag].sprite.size)) {
        var temp = moneyBag;
        delete moneyBags[moneyBag];
        /////
        playSoundOnEvent(moneyFoundSound);
        socket.emit('moneyDiscovered', moneyBag);
        score += 100;
      }  
    })
  }
}