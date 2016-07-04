function displayErrorToUserTimed (message) {
	//uses setTimeout -- fix? change?
	$("#display-error-container").show();
	$("#display-error-content").text(message);
	$("#display-error-content").prepend('<span>ALERT:</span> ');
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 3500);
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
	console.log("PLAYER BUILDINGS", player.buildings);
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

