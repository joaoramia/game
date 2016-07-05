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
	//but can still see other players moving -- intended
}

function checkIfGameOver() {
	if (!player.units[0]) {
		console.log(player.username);
		//announce to the world that someone died
		socket.emit("playerDied", {username: player.username});
		gameOver();
	}
}

function restartGame () {

}

// socket.on("notificationPlayerDied", function(data){
// 	displayNotificationPlayerDied(data.username);
// })