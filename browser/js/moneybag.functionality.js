function checkCollisionWithMoneyBag() {
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        var anyMoney = moneyTree.search({
            minX: unit.pos[0],
            minY: unit.pos[1],
            maxX: unit.pos[0] + unit.sprite.size[0],
            maxY: unit.pos[1] + unit.sprite.size[1]
        });
        if (anyMoney.length) {
            var moneyBag = anyMoney[0];
            var moneyBagName = '' + moneyBag.pos[0] + ',' + moneyBag.pos[1];
            var moneyBagData = {
                playerId: player.id,
                name: moneyBagName,
                value: moneyBag.value
            };
            delete moneyBags[moneyBagName];
            moneyTree.remove(moneyBag);
            playSoundOnEvent(moneyFoundSound);
            socket.emit('moneyDiscovered', moneyBagData);
            wealth += moneyBagData.value;
            $("#player-wealth-display").text(wealth);
        }
    }
}


function setupMoneyBags (moneyBagsFromServer) {
    // Adding moneybags to moneyTrees R-tree
    var toBeAddedToMoneyTree = [];

    moneyBags = moneyBagsFromServer;
    delete moneyBags.count;
    for (var moneyBag in moneyBags) {
        if (moneyBags.hasOwnProperty(moneyBag)) {
            //abstract THIS
            var coords = moneyBag.split(",");
            coords[0] = parseInt(coords[0]);
            coords[1] = parseInt(coords[1]);
            moneyBags[moneyBag].pos = coords;
            moneyBags[moneyBag].sprite = generateSprite("moneybag");

            toBeAddedToMoneyTree.push(prepForMoneyTree(moneyBags[moneyBag]));
        }
    }
    moneyTree.load(toBeAddedToMoneyTree);
}


