function heroIsSelected (array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i].type === "hero") {
			return true;
		}
	}
	return false;
}

function replaceButtonsOnMenu (newButtons) {
	$("#buttons-list").empty();
	newButtons.forEach(function(button){
		$("#buttons-list").append('<li id="' + button.tagName + '" class="a-button">' + button.text + '</li>');
		$("#buttons-list").on("click", "#" + button.tagName, button.clickFunction);
	})
}

function changeButtonsMessage (message) {
	if (typeof message === 'string') {
		$("#buttons-message-content").text(message);
	} else if (message === 1) {
		$("#buttons-message-content").text("1 unit selected");
	} else {
		$("#buttons-message-content").text("" + message.length + " units selected");
	}
}

function placeholderFunction(){
	console.log("This button doesn't do anything yet");
}

//add Patrol?

//buttons must be formatted in this way in order for replaceButtonsOnMenu to work
var heroSelectedButtons = [
	{text: "Build (B)", tagName: "build-button", clickFunction: updateForBuildMenu},
	{text: "Attack (A)", tagName: "attack-button", clickFunction: placeholderFunction},
	{text: "Defend (D)", tagName: "defend-button", clickFunction: placeholderFunction},
	{text: "Move (M)", tagName: "move-button", clickFunction: placeholderFunction}
]

var nonHeroSelectedButtons = [
	{text: "Attack (A)", clickFunction: placeholderFunction},
	{text: "Defend (D)", clickFunction: placeholderFunction},
	{text: "Move (M)", clickFunction: placeholderFunction}
];

function displayRootMenu (){
	//currently assumes there are only units
	if (currentSelection.length === 0) {
		//if no units selected
		changeButtonsMessage("No units selected");
		$("#buttons-list").empty();
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


