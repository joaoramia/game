function checkCollisionWithMoneyBag() {
  for (var moneyBag in moneyBags) {
    var moneyPos = moneyBags[moneyBag].pos;
    var moneySize = moneyBags[moneyBag].sprite.size;

    player.units.forEach(function(unit){
        if (moneyBags[moneyBag]){
            if (boxCollides(unit.pos, unit.sprite.size, moneyBags[moneyBag].pos, moneyBags[moneyBag].sprite.size)) {
            var moneyBagData = {
            playerId: player.id,
            name: moneyBag,
            value: moneyBags[moneyBag].value
            }
            delete moneyBags[moneyBag];
            playSoundOnEvent(moneyFoundSound);
            socket.emit('moneyDiscovered', moneyBagData);
            score += moneyBagData.value;
        }
      }  
    })
  }
}


function setupMoneyBags (moneyBagsFromServer) {
    moneyBags = moneyBagsFromServer;
    delete moneyBags.count;
    for (var moneyBag in moneyBags) {
        if (moneyBags.hasOwnProperty(moneyBag)) {
            var coords = moneyBag.split(",");
            coords[0] = parseInt(coords[0]);
            coords[1] = parseInt(coords[1]);
            moneyBags[moneyBag].pos = coords;
            moneyBags[moneyBag].sprite = generateSprite("moneybag");
        }
    }
}


