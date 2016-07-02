window.onresize = resizeViewport;

function resizeViewport () {
	//viewCanvas.width = window.innerWidth;
	//viewCanvas.height = window.innerHeight * .65;

	//http://cssdeck.com/labs/emcxdwuz

	//var height = window.innerHeight * .70;
	//var ratio = viewCanvas.width/viewCanvas.height;
	//var width = height * ratio;
	
	//viewCanvas.style.width = width+'px';
	//viewCanvas.style.height = height+'px';
	viewCanvas.width = window.innerWidth;
	viewCanvas.height = window.innerHeight; //height;
	//draw viewport function in render
}

	



