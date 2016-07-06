function gameOver(){
	//make appropriate changes to GUI
	$("#gameover-overlay").show();
	$("#world-wealth-display").hide();
	$("#game-controls").hide();
	//canvas should no longer be scrollable

	//destroy the player's representation of its moneybags and its buildings/units
	//but can still see other players moving -- intended
	player.units = {};
	player.building = {};
	moneyBags = {};
	//announce to the world that someone died
	socket.emit("playerDied", {username: player.username});
}

function checkIfGameOver() {
	if (!player.units[0]) {
		gameOver();
	}
}

$("#game-over-message-box button").click(function(){
	restartGame();
})

function restartGame () {
	socket.emit("respawn", {username: player.username});
	$("#gameover-overlay").hide();
	$("#world-wealth-display").show();
	$("#game-controls").show();
}

socket.on("notificationPlayerDied", function(data){
 	displayNotificationPlayerDied(data.username);
})