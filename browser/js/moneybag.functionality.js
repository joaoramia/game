function checkCollisionWithMoneyBag() {
  for (var moneyBag in moneyBags) {
    var moneyPos = moneyBags[moneyBag].pos;
    var moneySize = moneyBags[moneyBag].sprite.size;

    if (boxCollides(player.pos, player.sprite.size, moneyBags[moneyBag].pos, moneyBags[moneyBag].sprite.size)) {
      var temp = moneyBag;
      delete moneyBags[moneyBag];
      /////
      playSoundOnEvent(moneyFoundSound);
      socket.emit('moneyDiscovered', moneyBag);
      score += 100;
    }
  }
}