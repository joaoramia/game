socket.on("leaderboardUpdate", function(playersData){
    var leaders = [];
    for (var id in playersData) {
		leaders.push([id, playersData[id].wealth, playersData[id].username]);
	}
	leaders.sort(function(a, b) { return a[1] - b[1]; });

    if (playersData){
        player.wealth = playersData[player.id].wealth;
        if (Object.keys(otherPlayers)){
        	console.log("OTHER PLAYERS: ", otherPlayers);
            for (var id in otherPlayers){
                if (otherPlayers[id] && otherPlayers[id].wealth) otherPlayers[id].wealth = playersData[id].wealth;
            }
        }
        if(player.id === currentKing){
        // 	$("#kingname").text(player.username);
        //     $("#king-wealth-display").text(commaSeparator(player.wealth));
        // }
        // else {
        //     $("#king-wealth-display").text(commaSeparator(otherPlayers[currentKing].wealth));
        }
    }

    for (var i = 0; i < 5; i++){
    	if (leaders[i] && i === 0) {
    		$("#king-wealth-display").text(commaSeparator(leaders[i][1]));
    		$("#kingname").text(leaders[i][2]);
    	}
    	if (leaders[i] && i !== 0) {
    		$("#place" + (i + 1)).text(leaders[i][2] + " " + commaSeparator(leaders[i][1]));
    	}
    }
    $("#player-wealth-display").text(commaSeparator(player.wealth));
})

function commaSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortPlayersPositions(obj){
	// var maxSpeed = {
 //    car:300, bike:60, motorbike:200, airplane:1000,
 //    helicopter:400, rocket:8*60*60
	// }
	var sortable = [];
	for (var id in obj) {
		sortable.push([id, obj[id].wealth]);
		sortable.sort(function(a, b) {
		        return a[1] - b[1]
		    }
		);
	}
}