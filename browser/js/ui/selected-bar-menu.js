var selectedBarMenuButtons = [
	{text: "Hire Mercenary", tagName: "hire-mercenary", clickFunction: hireMercenary}, //(M)
	//{text: "Hire Assault (L)", tagName: "hire-assault", clickFunction: hireAssault},
	{text: "Set Rally Point", tagName: "set-rendezvous", clickFunction: setRendezvous} //(O)
];

var lastSelectedBuilding; //replace later -- make null if not building not selected on last selection
var rendezvousMode = {
	on: false,
	mostRecentRendezvous: null

}

function updateProductionQueueDisplay (currentBuilding) {
	$("#unit-thumbnail-container").empty();
	if (currentBuilding.productionQueue.length === 0) {
		$("#building-status").text("Currently inactive");
		$("#building-panel-unit-name").html("&nbsp;");
	} else {
		$("#building-status").text("Hiring...");
		var unitType = currentBuilding.productionQueue[0];
		$("#building-panel-unit-name").text("Mercenary");
	}
	currentBuilding.productionQueue.forEach(function (item) {
		$("#unit-thumbnail-container").append('<img src="img/soldier-button.jpg">');
	})
}

function hireMercenary(){
	//need to send building id with each request
	//add requested unit to the queue of the building selected
	var buildingId = lastSelectedBuilding.id.toString(); //needs to be a string
	var playerId = player.id;
	var unit = "mercenary";
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

//idea for later: separate functions for the display information of buildings
//and the buildings themselves

socket.on("hireMercenaryResponse", function (data) {
	if (data.valid === false) {
		if (data.error === "lacking resources") {
			displayErrorToUserTimed("You don't have enough money to hire a mercenary. Make more money!");
		} else if (data.error === "surpasses cap") {
			displayErrorToUserTimed("You don't have enough housing to hire another soldier. Build more houses!");
		} else if (data.error === "queue full") {
			displayErrorToUserTimed("The queue is full! You must wait before you can hire more units at this building.");
		}
	//if valid but receiving progress updates, unit in process of hiring
	} else if (data.progress) {
		var currentlySelectedBuilding = currentSelection[0];
		console.log("CURRENT SELECTION", currentSelection[0]);
		console.log("THE ID FROM CURRENT SELECTION", currentlySelectedBuilding.id);
		console.log("BUILDING ID", data.buildingId);
		var hiringBuilding = player.buildings[data.buildingId];
		console.log("HIRING BUILDING", hiringBuilding);
		hiringBuilding.progress = data.progress;
		//change the text of the info box so it states what's being built
		if (currentlySelectedBuilding.id === data.buildingId) {
			//update color
			if (data.progress < 8) {
				$("#progress-bar").css("background-color", "red");
			} else if (data.progress < 17) {
				$("#progress-bar").css("background-color", "#FFD700");
			} else {
				$("#progress-bar").css("background-color", "#00FF00");
			}
			//update length
			var percent = (data.progress * 100) / 20;
			$("#progress-bar").css("width", "" + percent + "%");
		} 
	}		
})

socket.on('mercenaryComplete', function (data) {
	var newUnit = data.newUnit;
	var currentlySelectedBuilding = currentSelection[0];
	var hiringBuilding = player.buildings[data.buildingId];
	//only add to player object if id on unit matches id of player 
	if (player.id === newUnit.socketId) {
		//update building's queue 
		hiringBuilding.productionQueue.shift();
		//if currently selected building
		if (currentlySelectedBuilding.id === hiringBuilding.id && currentlySelectedBuilding.socketId === player.id) {
			//update bar to show that unit is complete 
			$("#progress-bar").css("width", "" + 0 + "%");
			//update display of production queue
			updateProductionQueueDisplay(currentlySelectedBuilding);
		}

		newUnit.sprite = generateSprite("soldier", true, newUnit.socketId);
		player.units[newUnit.id] = newUnit;
		updateSupplyDisplay();
	//else, add to otherPlayers object
	} else {
		newUnit.sprite = generateSprite("soldier", false, newUnit.socketId);
		otherPlayers[newUnit.socketId].units[newUnit.id] = newUnit;
	}
})

socket.on('addToQueue', function (data) {
	var buildingId = parseInt(data.buildingId);
	player.buildings[buildingId].productionQueue.push(data.type);
	var currentBuilding = currentSelection[0];
	updateProductionQueueDisplay(currentBuilding);
});



