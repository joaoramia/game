socket.on("leaderboardUpdate", function(playersData){
    var leaders = [];
    for (var id in playersData) {
		leaders.push([id, playersData[id].wealth, playersData[id].username]);
	}
	leaders.sort(function(a, b) { return  b[1] - a[1]; });

    if (playersData){
        player.wealth = playersData[player.id].wealth;
        if (Object.keys(otherPlayers)){
            for (var id in otherPlayers){
                if (otherPlayers[id] && otherPlayers[id].wealth) otherPlayers[id].wealth = playersData[id].wealth;
            }
        }
        if(player.id === currentKing){
        	$("#kingname").text(player.username);
            $("#king-wealth-display").text(commaSeparator(player.wealth));
        }
        else {
        	$("#kingname").text(otherPlayers[currentKing].username);
            $("#king-wealth-display").text(commaSeparator(otherPlayers[currentKing].wealth));
        }
    }
    
    console.log(leaders);

    for (var i = 1; i < leaders.length; i++){
    	if (leaders[i] && i > 0) {
    		$("#place" + (i + 1)).text(leaders[i][2] + " " + commaSeparator(leaders[i][1]));
    	}
    }
    $("#player-wealth-display").text(commaSeparator(player.wealth));
})

function commaSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortPlayersPositions(obj){
	var sortable = [];
	for (var id in obj) {
		sortable.push([id, obj[id].wealth]);
		sortable.sort(function(a, b) {
		        return a[1] - b[1]
		    }
		);
	}
}