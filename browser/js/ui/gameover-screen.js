function gameOver(){
	//make appropriate changes to GUI
	$("#gameover-overlay").show();
	$("#world-wealth-display").hide();
	$("#ui-buttons").hide();
	//canvas should no longer be scrollable

	//destroy the player's representation of its moneybags and its buildings/units
	player.units = {};
	player.building = {};
	moneyBags = {};
	//can still see other players moving
}

function checkIfGameOver() {
	if (player.units[0].currentHealth < 1) {
		gameOver();
	}
}

function restartGame(){

}