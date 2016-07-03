var selectedBarMenuButtons = [
	{text: "Hire Mercenary (M)", tagName: "hire-mercenary", clickFunction: hireMercenary},
	{text: "Hire Assault (L)", tagName: "hire-assault", clickFunction: hireAssault},
	{text: "Set Rendezvous (O)", tagName: "set-rendezvous", clickFunction: setRendezvous}
];

var lastSelectedBuilding; //replace later -- make null if not building not selected on last selection

function hireMercenary(){
	//need to send building id with each request
	//add requested unit to the queue of the building selected
	var buildingId = lastSelectedBuilding.id.toString();
	console.log("BUILDING ID?", buildingId);
	//logs undefined. save to a variable
	var playerId = player.id;
	var unit = "mercenary";
	socket.emit('hireMercenaryRequest', {buildingId: buildingId, playerId: playerId, unit: unit});
}

function hireAssault(){
	console.log("CAN'T HIRE ASSAULT YET");
}

function setRendezvous() {
	console.log("CAN'T DO THIS YET");
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
		console.log(data);
		var percent = (data.progress * 100) / 16;
		if (data.progress < 6) {
			$("#progress-bar").css("background-color", "red");
		} else if (data.progress < 12) {
			$("#progress-bar").css("background-color", "yellow");
		} else {
			$("#progress-bar").css("background-color", "green");
		}
		$("#progress-bar").css("width", "" + percent + "%");
	} else {
		//if complete, erase progress bar
		$("#progress-bar").css("width", "" + 0 + "%");
	}
})

