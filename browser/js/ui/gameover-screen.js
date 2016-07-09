function gameOver(){
	//make the render function stop checking if its game over
	gameOver = true;
	//make appropriate changes to GUI
	$("#fullscreen-overlay").show();
	$("#game-over-message-box").show();
	$("#world-wealth-display").hide();
	$("#game-controls").hide();
	$("#login-screen").hide();
	//canvas should no longer be scrollable

	//destroy the player's representation of its moneybags and its buildings/units
	//but can still see other players moving -- intended
	player.units = {};
	player.building = {};
	moneyBags = {};
	//announce to the world that someone died
	socket.emit("playerDied", {username: player.username, playerId: player.id});
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
	$("#fullscreen-overlay").hide();
	$("#world-wealth-display").show();
	$("#game-controls").show();
	gameOver = false;
}

socket.on("notificationPlayerDied", function(data){
 	displayNotificationPlayerDied(data.username);
 	otherPlayers[data.playerId].units = {};
 	otherPlayers[data.playerId].buildings = {};
})