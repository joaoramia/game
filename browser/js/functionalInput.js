var attackPending = false;
document.addEventListener('keypress', function (e) {
    var keyPressed;
	switch(e.keyCode) {
    case 97:
        keyPressed = 'ATTACK'; break;
    case 68:
        keyPressed = 'DEFENSE'; break;
    case 113:
        keyPressed = 'QUIT'; break;
      case 96:
          keyPressed = 'CHAT'; break;

    }
    if (keyPressed === 'ATTACK') {
    	attackModeOn();
    } else if (keyPressed === 'DEFENSE') {
        defenseModeOn();
    } else if (keyPressed === 'QUIT') {
    	if (attackPending) attackModeOff();
    }else if ( keyPressed === 'CHAT'){
        $('#chat-client').toggle();
        $('#m').focus();
      return false;
        //  .keyup( ()=>{
        //    $('#m').val('');
        //})
    }

});

//document.addEventListener('keyup', function(e){
//    if(e.keyCode == 96 ){
//        console.log("aahhaha")
//    };
//})