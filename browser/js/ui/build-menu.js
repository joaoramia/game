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
	console.log("I TELL YOU WHETHER YOU CAN BUILD!", data);
	//first check to see if the player has enough money to build a bar
	if (data.request === 1) {
	//if player doesn't have money...
		if (data.valid === false) {
			//tell them they need more money
			console.log("user cannot build building")
			displayErrorToUser("You don't have enough money to build that! Get more money!");
			//reset the menu
			updateButtonMenuOnClick();

		} else {
		//if player does, cursor changes to be building
			console.log("user can build building. where?");
		//check that user still has enough money before approving
		
		}

	//before user 
	} else if (data.request === 2) {

	}
})

function buildBankRequest() {
	console.log("This button builds a bank!");
}

function buildHouseRequest() {
	console.log("This button builds a house!");
}


