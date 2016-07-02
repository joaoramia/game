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

socket.on('buildBar', function(data){
	//first check to see if the player has enough money to build a bar
	if (data.request === 1) {
	//if player doesn't have money...
		if (data.valid === false) {
			//tell them they need more money
			displayErrorToUser("You don't have enough money to build that! Make more money!");
			//reset the menu
			updateButtonMenuOnClick();
		} else {
			console.log("user can build building. where?");
			//if player does, cursor changes to be building
			//wherever user clicks a building is built
			socket.emit('checkIfPlayerCanBuildBar', {pos: [400, 400], id: player.id, request: 2});
		}
	//send another request to create the building object on the server
	} else if (data.request === 2) {
		//if player ran out of money since placing building, can't build
		if (data.valid === false) {
			displayErrorToUser("You don't have enough money to build that anymore! Make more!");
			updateButtonMenuOnClick();
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


