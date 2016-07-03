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