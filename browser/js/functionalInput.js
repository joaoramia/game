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

  // ignore the hot keys if focused on input field
  if (!$(e.target).is('input, textarea, select') || keyPressed ==='CHAT' ) {
    if (keyPressed === 'ATTACK') {
      attackModeOn();
    } else if (keyPressed === 'DEFENSE') {
      defenseModeOn();
    } else if (keyPressed === 'QUIT') {
      if (attackPending) attackModeOff();
    }else if ( keyPressed === 'CHAT'){
      $('#chat-client').toggle();
      $('#m').focus();
      e.preventDefault(); // to prevent typing ` in the input field
    }
  }


});
