var buildMenuButtons = [
	{text: "Bar (K)", tagName: "build-bar", clickFunction: buildBar},
	{text: "Bank (H)", tagName: "build-bank", clickFunction: buildBank},
	{text: "House (L)", tagName: "build-house", clickFunction: buildHouse}
];

function buildBar(){
	console.log("This button builds a bar!");
	//first check to see if the player has enough money to build a bar

	//if player doesn't have money, tell them they need more money

	//if player does, cursor changes to be building
}

function buildBank() {
	console.log("This button builds a bank!");
}

function buildHouse() {
	console.log("This button builds a house!");
}

