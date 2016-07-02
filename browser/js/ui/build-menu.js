var buildMenuButtons = [
	{text: "Bar (K)", tagName: "build-bar", clickFunction: buildBarRequest},
	{text: "Bank (H)", tagName: "build-bank", clickFunction: buildBankRequest},
	{text: "House (L)", tagName: "build-house", clickFunction: buildHouseRequest}
];

function buildBarRequest(){
	//initiate the request to build a bar
	var requestObj = {id: player.id, request:1};
	socket.emit('checkIfPlayerCanBuildBar', requestObj);
}

function submitBuildingLocation (pos) {
  var requestObj = {pos: pos, id: player.id, request: 2};
  socket.emit('checkIfPlayerCanBuildBar', requestObj);
}

function buildModeOn(type){
	buildMode.on = true;
	buildMode.type = type;
	displayErrorToUserUntimed("BUILD MODE", "Select a location to build, or press Esc to quit.");
	$("#buttons-list").empty();
}

function buildModeOff(){
	buildMode.on = false;
	buildMode.type = "";
	turnOffUntimedMessage();
}

socket.on('buildBar', function(data){
	//first check to see if the player has enough money to build a bar
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
			buildModeOn("bar"); 
			//run submitBuildingLocation on click when in buildMode
		}
	//send another request to create the building object on the server
	} else if (data.request === 2) {
		//if player ran out of money since placing building, can't build
		if (data.valid === false && data.error === "lacking resources") {
			displayErrorToUserTimed("You don't have enough money to build that anymore! Make more!");
			displayRootMenu();
		//if the player chooses an an invalid location
		} else if (data.valid === false && data.error === "collision") {
			displayErrorToUserTimed("You can't build there! There's something in the way!");
			displayRootMenu();
		} else {
		//if building is valid, update the player's buildings object
		player.buildings[data.name] = data.bar;
		player.buildings[data.name].sprite = generateSprite(data.bar.type, true);
		//update the player's wealth
		player.wealth = data.currentWealth;
		$("#player-wealth-display").text(player.wealth);
		console.log(player.buildings);
		}
	}
})

function buildBankRequest() {
	console.log("This button builds a bank!");
}

function buildHouseRequest() {
	console.log("This button builds a house!");
}


