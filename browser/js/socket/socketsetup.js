function setupSocket (socket) {
    socket.on("existingInfo", function(playersColl, moneyBagColl){
        setupExistingPlayers(socket, playersColl);
        setupMoneyBags(moneyBagColl);
    });

    socket.on("gameReady", function(gameData, king) {
        console.log("GAME READY DATA", gameData);
        adjustVPOnGameReady(gameData.playerData.units[0].pos);
        gameOver = false;
        gameStarted = true;
        currentKing = king;
        player = gameData.playerData;
        wealth = gameData.playerData.wealth;

        // set a color for the chat
        player.color = colorArray[getRandomNum(colorArray.length - 1)];

        for (var unitId in player.units) {
            var unit = player.units[unitId];
            unit.sprite = generateSprite(unit.type, true, player.id);
        }

        // for (var id in player.buildings) {
        //     var building = player.buildings[id];
        //     building.sprite = generateSprite(building.type, true, player.id);
        // }
    });

    socket.on('otherPlayerJoin', function (otherPlayerData) {
        console.log(otherPlayerData.id + ' has joined!');

        var toBeAddedToTree = [];

        newPlayerJoinsAlert(otherPlayerData.username);

        // generate the new players sprites
        for (var unitId in otherPlayerData.units) {
            var unit = otherPlayerData.units[unitId];
            unit.sprite = generateSprite(unit.type, false, otherPlayerData.id);

            toBeAddedToTree.push(prepForUnitTree(unit));
        }
        for (var id in otherPlayerData.buildings) {
            var building = otherPlayerData.building[id];
            building.sprite = generateSprite(building.type, false, otherPlayerData.id);
        }
        otherPlayers[otherPlayerData.id] = otherPlayerData;

        tree.load(toBeAddedToTree);
    });

    socket.on('otherPlayerDC', function (socketId) {
        console.log(socketId + ' left!');

        removeFromTreeOnDisconnect(socketId);

        var departingUserUsername = otherPlayers[socketId].username;
        newPlayerLeavesAlert(departingUserUsername);

        delete otherPlayers[socketId];
    });


    socket.on('takeThat', function (victim, damage) {
        if (player.id === victim.socketId) {
            player.units[victim.id].currentHealth -= damage;
            player.units[victim.id].hit = true;
        } else {
            otherPlayers[victim.socketId].units[victim.id].currentHealth -= damage;
        }
    });

    socket.on("leaderboardUpdate", function(playersData){
        var leaders = [];
        for (var id in playersData) {
            leaders.push([id, playersData[id].wealth, playersData[id].username]);
        }
        leaders.sort(function(a, b) { return  b[1] - a[1]; });

        if (playersData){
            player.wealth = playersData[player.id].wealth;
            if (Object.keys(otherPlayers)){
                for (var id in otherPlayers){
                    if (otherPlayers[id] && otherPlayers[id].wealth) otherPlayers[id].wealth = playersData[id].wealth;
                }
            }
            if(player.id === currentKing){
                $("#kingname").text(player.username);
                $("#king-wealth-display").text(commaSeparator(player.wealth));
            }
            else {
                $("#kingname").text(otherPlayers[currentKing].username);
                $("#king-wealth-display").text(commaSeparator(otherPlayers[currentKing].wealth));
            }
        }

        for (var i = 1; i < leaders.length; i++){
            if (leaders[i] && i > 0) {
                $("#place" + (i + 1)).text(leaders[i][2] + " " + commaSeparator(leaders[i][1]));
            }
        }
        $("#player-wealth-display").text(commaSeparator(player.wealth));
    });

    setupChatSocket(socket);

    // socket.on('moneyBagsUpdate', function (moneyBagsFromServer){
    //     setupMoneyBags(moneyBagsFromServer);
    // });

    socket.on('deleteAndUpdateMoneyBags', function (bagUpdate) {
        delete moneyBags[bagUpdate.deletedBagName];
        moneyBags[bagUpdate.newBagName] = bagUpdate.newBagValue;
        //abstract this away
        var coords = bagUpdate.newBagName.split(",");
        coords[0] = parseInt(coords[0]);
        coords[1] = parseInt(coords[1]);
        var thisMoneyBag = moneyBags[bagUpdate.newBagName];
        thisMoneyBag.pos = coords;
        thisMoneyBag.sprite = generateSprite("moneybag");
        
        moneyTree.insert(prepForMoneyTree(thisMoneyBag));

    });

    socket.on('newKing', function(newKing){
        var previousKing = currentKing;
        currentKing = newKing;
        if (player.id === currentKing) {
            player.units[0].sprite = generateSprite(player.units[0].type, true, player.id);
            if(otherPlayers[previousKing]) otherPlayers[previousKing].units[0].sprite = generateSprite(otherPlayers[previousKing].units[0].type, false, previousKing);
        }
        else if (otherPlayers[currentKing]){
            otherPlayers[currentKing].units[0].sprite = generateSprite(otherPlayers[currentKing].units[0].type, false, currentKing);
            if (otherPlayers[previousKing]) otherPlayers[previousKing].units[0].sprite = generateSprite(otherPlayers[previousKing].units[0].type, false, previousKing);
            if (player.id === previousKing) player.units[0].sprite = generateSprite(player.units[0].type, true, player.id);
        }
    });
}

function fireSocketForInfo () {
    socket.emit('giveExistingInfo');
}

function setupExistingPlayers (socket, playersCollection) {
    otherPlayers = playersCollection;
    /*
    for each of the other players, assign each unit,
    its appropriate sprite
    */
    var toBeAddedToTree = [];

    for (var otherPlayer in otherPlayers){
        if (otherPlayers.hasOwnProperty(otherPlayer)){
            //for each player assign each unit its appropriate sprint
            for (var unitId in otherPlayers[otherPlayer].units) {
                var unit = otherPlayers[otherPlayer].units[unitId];
                unit.sprite = generateSprite(unit.type, false, otherPlayer.id);

                // add unit to an array built to be inserted into r-Tree
                // better than adding one by one because bulk insert is way faster
                toBeAddedToTree.push(prepForUnitTree(unit));
                
            }
            for (var id in otherPlayers[otherPlayer].buildings) {
                var building = otherPlayers[otherPlayer].buildings[id];
                building.sprite = generateSprite(building.type, false, otherPlayer.id);
            }
        }
    }
    tree.load(toBeAddedToTree);
}