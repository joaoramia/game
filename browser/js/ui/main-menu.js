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

function changeMessage (message) {

}

//add Patrol?
var heroButtons = ["Build (B)", "Attack (A)", "Defend (D)", "Move (M)"];
var nonHeroButtons = ["Attack (A)", "Defend (D)", "Move (M)"];

function updateButtonMenu (){
	//currently assumes there are only units
	if (currentSelection.length === 0) {
		//if no units selected
		//change message
	} else if (heroIsSelected(currentSelection)) {
		//if hero is selected
		replaceButtonsOnMenu(heroButtons);
	} else {
		//if any unit other than hero is selected
		replaceButtonsOnMenu(nonHeroButtons);
	}
}