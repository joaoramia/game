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
	newButtons.forEach(function(buttonText){
		$("#buttons-list").append('<li class="a-button">' + buttonText + '</li>');
	})
}

function changeButtonsMessage (message) {
	console.log("MESSAGE", message);
	if (typeof message === 'string') {
		$("#buttons-message-content").text(message);
	} else if (message === 1) {
		$("#buttons-message-content").text("1 unit selected");
	} else {
		$("#buttons-message-content").text("" + message.length + " units selected");
	}
}

//add Patrol?
var heroButtons = ["Build (B)", "Attack (A)", "Defend (D)", "Move (M)"];
var nonHeroButtons = ["Attack (A)", "Defend (D)", "Move (M)"];

function updateButtonMenu (){
	//currently assumes there are only units
	console.log("CURRENT SELECTION", currentSelection);
	if (currentSelection.length === 0) {
		//if no units selected
		changeButtonsMessage("No units selected");
		$("#buttons-list").empty();
	} else if (heroIsSelected(currentSelection)) {
		//if hero is selected
		changeButtonsMessage("Hero selected. Build!");
		replaceButtonsOnMenu(heroButtons);
	} else {
		//if any unit other than hero is selected
		changeButtonsMessage(currentSelection.length);
		replaceButtonsOnMenu(nonHeroButtons);
	}
}