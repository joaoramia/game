
var buildMenuButtons = [
	{text: "Bar (K)", tagName: "build-bar", clickFunction: placeholderFunction},
	{text: "Bank (H)", tagName: "build-bank", clickFunction: placeholderFunction}
]

function updateForBuildMenu (){
	changeButtonsMessage("Select a building");
	replaceButtonsOnMenu(buildMenuButtons);
}
