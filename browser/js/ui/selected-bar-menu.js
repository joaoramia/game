var selectedBarMenuButtons = [
	{text: "Hire Mercenary (M)", tagName: "hire-mercenary", clickFunction: hireMercenary},
	{text: "Hire Assault (L)", tagName: "hire-assault", clickFunction: hireAssault},
	{text: "Set Rally Point (O)", tagName: "set-rendezvous", clickFunction: setRendezvous}
];

var lastSelectedBuilding; //replace later -- make null if not building not selected on last selection
var rendezvousMode = {
	on: false,
	mostRecentRendezvous: null

}

function hireMercenary(){
	//need to send building id with each request
	//add requested unit to the queue of the building selected
	var buildingId = lastSelectedBuilding.id.toString(); //needs to be a string
	var playerId = player.id;
	var unit = "mercenary";
	console.log("EMITTING ONLY ONCE? HIRE MERCENARY");
	socket.emit('hireMercenaryRequest', {buildingId: buildingId, playerId: playerId, unit: unit});
}

function hireAssault(){
	console.log("CAN'T HIRE ASSAULT YET");
}

function setRendezvous() {
	displayErrorToUserUntimed("RENDEZVOUS MODE", "Set a rally point for this building's units, or press Esc to quit.");
	$("#buttons-list").empty();
	rendezvousMode.on = true;
}

function submitRendezvousPosition (pos) {
	displayErrorToUserTimed("New rendezvous point set!");
	rendezvousMode.on = false;
	socket.emit('newRendezvousPosition', {pos: pos, playerId: player.id, buildingId: lastSelectedBuilding.id});
	updateForSelectedBuilding("bar");
}

socket.on("hireMercenaryResponse", function (data) {
	if (data.valid === false) {
		if (data.error === "lacking resources") {
			displayErrorToUserTimed("You don't have enough money to hire a mercenary. Make more money!");
		} else if (data.error === "surpasses cap") {
			displayErrorToUserTimed("You don't have enough housing to hire another soldier. Build more houses!");
		}
	//if valid but receiving progress updates, unit in process of hiring
	} else if (data.progress) {
		//change the text of the infobox so it states what's being built
		var percent = (data.progress * 100) / 20;
		if (data.progress < 8) {
			$("#progress-bar").css("background-color", "red");
		} else if (data.progress < 17) {
			$("#progress-bar").css("background-color", "#FFD700");
		} else {
			$("#progress-bar").css("background-color", "#00FF00");
		}
		$("#progress-bar").css("width", "" + percent + "%");
	//if complete, erase progress bar
	} else if (data.newUnit) {
		$("#progress-bar").css("width", "" + 0 + "%");
		//empty the text field
		var newUnit = data.newUnit;
		//only add to player object if id on unit matches id of player 
		if (player.id === newUnit.socketId) {
			newUnit.sprite = generateSprite("soldier", true, newUnit.socketId);
			player.units[newUnit.id] = newUnit;
		//else, add to otherPlayers object
		} else {
			newUnit.sprite = generateSprite("soldier", false, newUnit.socketId);
			otherPlayers[newUnit.socketId].units[newUnit.id] = newUnit;
		}
		updateSupplyDisplay();
	}
})

