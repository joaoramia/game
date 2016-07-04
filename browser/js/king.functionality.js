function changeKing(currentPlayer){
	for (var unit in currentPlayer.units){
		if (currentPlayer.units[unit].type === 'hero'){
            currentPlayer.units[unit].url = 'img/hero/hero-1.png';
            currentPlayer.units[unit].size = [32, 0];
            currentPlayer.units[unit].frames = [0, 1, 2];
            currentPlayer.units[unit].speed = 16;
		}
	}
}

// function becomeKing(newKing){
// 	if (player.id === newKing){
// 		for (var unit in player.units){
// 			if (player.units[unit].type === 'hero'){
// 				player.units[unit].url = 'img/hero/king.png';
// 		        player.units[unit].size = [34, 50];
// 		        player.units[unit].frames = [0, 1, 2, 3];
// 		        player.units[unit].speed = 10;
// 		        return;
// 			}
// 		}
// 	}
// 	if (otherPlayers[newKing]){
// 		for (var unit in otherPlayers[newKing].units){
// 			if (otherPlayers[newKing].units[unit].type === 'hero'){
// 				otherPlayers[newKing].units[unit].url = 'img/hero/king.png';
// 		        otherPlayers[newKing].units[unit].size = [34, 50];
// 		        otherPlayers[newKing].units[unit].frames = [0, 1, 2, 3];
// 		        otherPlayers[newKing].units[unit].speed = 10;
// 		        return;
// 			}
// 		}
// 	}
// }