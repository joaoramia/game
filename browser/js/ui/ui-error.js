function displayErrorToUser (message) {
	//uses setTimeout -- fix? change?
	$("#display-error-container").show();
	$("#display-error-content").text(message);
	$("#display-error-content").prepend('<span>ALERT:</span> ');
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 3500);
}
