function gameOver(){
	console.log("The game over function says hello");
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
		console.log(player.username);
		gameOver();
	}
}

$("#game-over-message-box button").click(function(){
	restartGame();
})

function restartGame () {
	
}

// socket.on("notificationPlayerDied", function(data){
// 	displayNotificationPlayerDied(data.username);
// })