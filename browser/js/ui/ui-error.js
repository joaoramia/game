function displayErrorToUserTimed (message) {
	//uses setTimeout -- fix? change?
	$("#display-error-container").show();
	$("#display-error-content").text(message);
	$("#display-error-content").prepend('<span>ALERT:</span> ');
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 3500);
	playSoundOnEvent(cancelSound);
}

function newPlayerJoinsAlert (playerName) {
	//uses setTimeout -- fix? change?
	$("#display-error-container").show();
	$("#display-error-content").text(playerName + " has joined the game.");
	$("#display-error-content").prepend('<span>NEW PLAYER:</span> ');
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 2500);
	playSoundOnEvent(cancelSound);
}

function newPlayerLeavesAlert (playerName) {
	//uses setTimeout -- fix? change?
	$("#display-error-container").show();
	$("#display-error-content").text(playerName + " has left the game.");
	//$("#display-error-content").prepend('<span>NEW PLAYER:</span> ');
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 2500);
	playSoundOnEvent(cancelSound);
}

function displayNotificationPlayerDied (playerName) {
	$("#display-error-container").show();
	$("#display-error-content").text(playerName + " has been eliminated!");
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 3000);
	//change sound later
	playSoundOnEvent(cancelSound);
}

function displayErrorToUserUntimed (capsText, message) {
	$("#display-error-container").show();
	$("#display-error-content").text(message);
	$("#display-error-content").prepend('<span>' + capsText + ':</span> ');
}

function turnOffUntimedMessage () {
	$("#display-error-container").hide();
}

function currentSupply() {
	var count = 0;
	for (unit in player.units) {
		if (player.units.hasOwnProperty(unit)) {
			count++;
		}
	}
	return count;
}

function currentMaxSupply() {
	var count = 10;
	for (building in player.buildings) {
		if (player.buildings.hasOwnProperty(building)) {
			console.log("player.buildings[building].type", player.buildings[building].type)
			if (player.buildings[building].type === "house") {
				count += 10;
				if (count >= player.absoluteMaxSupply) {
					return count;
				}
			}
		}
	}
	return count;
};

function updateSupplyDisplay(){
	var updatedSupplyText = "" + currentSupply() + "/" + currentMaxSupply();
	$("#supply-cap-display").text(updatedSupplyText);
}

