var buildMenuButtons = [
	{text: "Bar (K)", tagName: "build-bar", clickFunction: buildBarRequest},
	{text: "Bank (H)", tagName: "build-bank", clickFunction: buildBankRequest},
	{text: "House (L)", tagName: "build-house", clickFunction: buildHouseRequest}
];

function buildBarRequest(){
	console.log("This button builds a bar!");
	var requestObj = {id: player.id};
	//first check to see if the player has enough money to build a bar
	socket.emit('checkIfPlayerHasEnoughMoneyForBar', requestObj);
}

function buildBankRequest() {
	console.log("This button builds a bank!");
}

function buildHouseRequest() {
	console.log("This button builds a house!");
}

socket.on("buildBar", function(barData){
	if (barData === false) {
	//if player doesn't have money, tell them they need more money

	} else {
	//if player does, cursor changes to be building

	//check that user still has enough money before approving
	
	}
	
})
