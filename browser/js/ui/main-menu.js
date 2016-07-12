function heroIsSelected (array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].type === "hero") {
			return true;
		}
	}
	return false;
}

function buildingSelected (array) {
	if (array[0].type === "bar" || array[0].type === "house" || array[0].type === "bank") return true;
	else false;
}

function replaceButtonsOnMenu (newButtons) {
	$("#buttons-list").empty();
	newButtons.forEach(function(button){
		$("#buttons-list").append('<div id="' + button.tagName + '" class="a-button">' + button.text + '</div>');
		$('#' + button.tagName).on("click", button.clickFunction);
	})
}

function changeButtonsMessage (message) {
	if (message === "&nbsp;") {
		$("#buttons-message-content").html("&nbsp;");
	} else if (typeof message === 'string') {
		$("#buttons-message-content").text(message);
	} else if (message === 1) {
		$("#buttons-message-content").text("1 unit selected");
	} else {
		$("#buttons-message-content").text("" + message + " units selected");
	}
}



function placeholderFunction(){
	console.log("This button doesn't do anything yet");
}

//add Patrol?

//buttons must be formatted in this way in order for replaceButtonsOnMenu to work
var heroSelectedButtons = [
	{text: "Build", tagName: "build-button", clickFunction: updateForBuildMenu}, //B
	{text: "Attack (A)", tagName: "attack-button", clickFunction: attackModeOn},
	{text: "Defend (D)", tagName: "defend-button", clickFunction: defenseModeOn},
	//{text: "Move (M)", tagName: "move-button", clickFunction: placeholderFunction}
]

var nonHeroSelectedButtons = [
	{text: "Attack (A)", clickFunction: attackModeOn},
	{text: "Defend (D)", clickFunction: defenseModeOn}, /
	//{text: "Move (M)", clickFunction: placeholderFunction}
];

function displayRootMenu (){
	if (currentSelection.length === 0) {
		//if no units selected
		changeButtonsMessage("&nbsp;");
		$("#buttons-list").empty();
	} else if (buildingSelected(currentSelection)) {
		//if building selected
		var buildingType = currentSelection[0].type;
		updateForSelectedBuilding(buildingType);
	} else if (heroIsSelected(currentSelection)) {
		//if hero is selected
		changeButtonsMessage("Hero selected. Build!");
		replaceButtonsOnMenu(heroSelectedButtons);
	} else {
		//if any unit other than hero is selected
		changeButtonsMessage(currentSelection.length);
		replaceButtonsOnMenu(nonHeroSelectedButtons);
	}
}

function updateForBuildMenu (){
	changeButtonsMessage("Select a building");
	replaceButtonsOnMenu(buildMenuButtons);
}

function updateForSelectedBuilding (type) {
	//first check if selected building is another player's building

	//must be current player's buliding. check for type
	if (type === "bar") {
		$("#building-info-panel").show();
		var currentBuilding = currentSelection[0];
		updateProductionQueueDisplay(currentBuilding);
		changeButtonsMessage("Bar selected");
		replaceButtonsOnMenu(selectedBarMenuButtons);
	} else if (type === "house") {
		changeButtonsMessage("House selected");
		$("#buttons-list").empty();
	}
}


