var selectedBarMenuButtons = [
	{text: "Hire Mercenary (M)", tagName: "hire-mercenary", clickFunction: hireMercenary},
	{text: "Hire Assault (L)", tagName: "hire-assault", clickFunction: hireAssault}
];



function hireMercenary(){
	console.log("CAN'T HIRE MERC YET");
	//need to send building id with each request
	//add requested unit to the queue of the building selected
	var buildingId = currentSelection[0].id;
	var playerId = player.id;
	var unit = "mercenary";
	socket.emit('hireMercenaryRequest', {buildingId: buildingId, playerId: playerId, unit: unit});
}

function hireAssault(){
	console.log("CAN'T HIRE ASSAULT YET");
}

socket.on("hireMercenaryResponse", function (data) {
	if (data.valid === false) {
		if (data.error === "lacking resources") {
			displayErrorToUserTimed("You don't have enough money to hire a mercenary. Make more money!");
		} else if (data.error === "surpasses cap") {
			displayErrorToUserTimed("You don't have enough housing to hire another soldier. Build more houses!");
		}
	} else {
	}
})

//listener receives updates until the building is complete