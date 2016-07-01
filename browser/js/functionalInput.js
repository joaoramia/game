var attackPending = false;

document.addEventListener('keypress', function (e) {
	var key;
	switch(e.keyCode) {
    case 97:
        key = 'ATTACK'; break;
    case 104:
        key = 'HOLD'; break;
    case 113: 
    	key = 'QUIT'; break;
    }
    if (key === 'ATTACK') {
    	attackPending = true;
    } else if (key === 'QUIT') {
    	if (attackPending) attackPending = false;
    }

});