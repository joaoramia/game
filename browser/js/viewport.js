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
	//draw viewport function in render
	viewCanvas.setAttribute('width', window.innerWidth);
	viewCanvas.setAttribute('height', window.innerHeight);
	viewCanvas.width = window.innerWidth;
	viewCanvas.height = window.innerHeight;
}

	



