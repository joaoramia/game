var buildMenuButtons = [
	{text: "Bar (K)", tagName: "build-bar", clickFunction: buildBar},
	{text: "Bank (H)", tagName: "build-bank", clickFunction: buildBank},
	{text: "House (L)", tagName: "build-house", clickFunction: buildHouse}
];

function sendBuildRequest (type){
	//initiate the request to build a bar
	var requestObj = {id: player.id, request:1, type: type};
	socket.emit('initialBuildRequest', requestObj);
}

function buildBar () {
	sendBuildRequest("bar");
}

function buildHouse (){
	sendBuildRequest("house");
}

function buildBank(){
	sendBuildRequest("bank");
}

function submitBuildingLocation (pos) {
  var requestObj = {pos: pos, id: player.id, request: 2, type: buildMode.type};
  socket.emit('finalBuildRequest', requestObj);
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

//building a building requires exchanging information with the server twice
socket.on('initialBuildResponse', function (data){
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
	console.log(data);
	if (data.valid && data.request === 2) {
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
		} else {
		//if building is valid, update the player's buildings object
		player.buildings[data.name] = data.buildingObj;
		player.buildings[data.name].sprite = generateSprite(data.buildingObj.type, true);
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
})


