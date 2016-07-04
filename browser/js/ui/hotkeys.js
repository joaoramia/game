//exit build mode or rendezvous mode
$("body").keyup(function(event){
	if (rendezvousMode.on) {
		//put all this in a function
		rendezvousMode.on = false;
		displayErrorToUserTimed("Exiting rendezvous mode.");
		//go back to menu of appropriate building	
	} else if (buildMode.on) {
		buildModeOff();
		displayErrorToUserTimed("Exiting build mode.");
		//go back to menu of appropriate building
	}
})