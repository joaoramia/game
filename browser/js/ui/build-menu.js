var buildMenuButtons = [
	{text: "Bar - $2000", tagName: "build-bar", clickFunction: buildBar}, //(K)
	//{text: "Bank (H)", tagName: "build-bank", clickFunction: buildBank},
	{text: "House - $1000", tagName: "build-house", clickFunction: buildHouse} //(L)
];

function sendBuildRequest (type){
	//initiate the request to build a bar
	var requestObj = {id: player.id, request:1, type: type};
	console.log("InitialBuildRequest: ",requestObj);
	socket.emit('initialBuildRequest', requestObj);
}

function buildBar () {
	sendBuildRequest("bar");
}

function buildHouse (){
	sendBuildRequest("house");
}

function buildBank () {
	sendBuildRequest("bank");
}

function submitBuildingLocation (pos, type) {
	var requestObj = {pos: pos, id: player.id, request: 2, type: buildMode.type, world: world};
	var newBuildingTiles = buildingTiles([pos[0],pos[1]], buildMode.type);
	console.log("finalBuildRequest: ",requestObj);
	socket.emit('finalBuildRequest', requestObj, newBuildingTiles);
}

function buildModeOn (type) {
	//run submitBuildingLocation on click when in buildMode
	buildMode.on = true;
	buildMode.type = type;
	displayErrorToUserUntimed("BUILD MODE", "Select a location to build, or press Esc to quit.");
	$("#buttons-list").empty();
}

function buildModeOff (){
	buildMode.on = false;
	buildMode.type = "";
	turnOffUntimedMessage();
}

function fillTilesOfBuilding (building){
	for (var x = 0; x < building.length; x++){
		world[building[x][0]][building[x][1]] = 1;
	}
}

//building a building requires exchanging information with the server twice
socket.on('initialBuildResponse', function (data){
	console.log("data of initial build response: ", data);
	//check to see if the player has enough money to build a bar
	if (data.request === 1) {
	//if player doesn't have money...
		if (data.valid === false) {
			//tell them they need more money
			displayErrorToUserTimed("You don't have enough money to build that! Make more money!");
			//reset the menu
			displayRootMenu();
		} else {
			//if player does, cursor changes to be building
			//enable build mode: build building where user clicks
			buildModeOn(data.type);
		}
	//send another request to create the building object on the server
	}
})

//after second response from the server
socket.on('finalBuildResponse', function (data) {
	console.log("data of final build response: ", data);
	if (data.request === 2 && data.socketId) {
		//if player ran out of money since placing building, can't build
		if (data.valid === false && data.error === "lacking resources") {
			displayErrorToUserTimed("You don't have enough money to build that anymore! Make more!");
			displayRootMenu();
		//if the player chooses an invalid location
		} else if (data.valid === false && data.error === "collision with building") {
			displayErrorToUserTimed("You can't build there! A building is in the way!");
			displayRootMenu();
		} else if (data.valid === false && data.error === "collision with unit") {
			displayErrorToUserTimed("You can't build there! A unit is in the way!");
			displayRootMenu();
		//if building is valid, update the player's buildings object
		} else {
			fillTilesOfBuilding(buildingTiles(data.buildingObj.pos, data.buildingObj.type));
			if (data.world) world = data.world;
			//check if building is current player's building
			if (data.socketId === player.id) {
				player.buildings[data.name] = data.buildingObj;
				player.buildings[data.name].sprite = generateSprite(data.buildingObj.type, true);
			} else {
				otherPlayers[data.socketId].buildings[data.name] = data.buildingObj;
				otherPlayers[data.socketId].buildings[data.name].sprite = generateSprite(data.buildingObj.type, false);
			}
			//update the player's wealth
			player.wealth = data.currentWealth;
			$("#player-wealth-display").text(player.wealth);
			playSoundOnEvent(buildingSound);
			updateSupplyDisplay();
			if (currentMaxSupply() >= player.absoluteMaxSupply) {
				displayErrorToUserTimed("Current maximum supply reached. Building more houses will not increase maximum supply.");
			}
		}
	}
	buildModeOff();
})
