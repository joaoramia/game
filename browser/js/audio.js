//load any audio
var moneyFoundSound = new Audio("audio/money-found-snd.wav");
var attackSound = new Audio('audio/marinegogogo.wav');

//use this function to play a sound
function playSoundOnEvent(snd) {
    if (!snd.paused) {
        snd.load();
        snd.play();
    } else {
        snd.play();
    }
}