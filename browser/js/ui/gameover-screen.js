function gameOver(){
	console.log("The game over function says hello");
	//make appropriate changes to GUI
	$("#gameover-overlay").show();
	$("#world-wealth-display").hide();
	$("#game-controls").hide();
	//canvas should no longer be scrollable

	//destroy the player's representation of its moneybags and its buildings/units
	player.units = {};
	player.building = {};
	moneyBags = {};
	//can still see other players moving
}

function checkIfGameOver() {
	if (!player.units[0]) {
		//announce to the world that someone died
		gameOver();
	}
}

function restartGame(){

}