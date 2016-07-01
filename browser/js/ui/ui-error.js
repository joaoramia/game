function displayErrorToUser (message) {
	//uses setTimeout -- fix? change?
	$("#display-error-container").show();
	$("#display-error-content").text('<span>ALERT:</span> ' + message);
	var hideError = setTimeout(function() {
		$("#display-error-container").hide();	
	}, 3000);
}
