function inRange(num1, num2, num3, num4){
    var temp = num3;
    if (num3 > num4) {
      num3 = num4;
      num4 = temp;
    }

    for (var i = num1; i <= num2; i++){
      if (i >= num3 && i <= num4){
        return true;
      }
    }
    return false;
}

function xMinLimit (e) {
  return (e.layerX < 15 && vp.pos[0] > 15);
}

function xMaxLimit (e) {
  return (e.layerX >= viewCanvas.width - 15 && vp.pos[0] < canvas.width - viewCanvas.width - 15);
}

function yMinLimit (e) {
  return (e.layerY < 15 && vp.pos[1] > 15);
}

function yMaxLimit (e) {
  return (e.layerY >= viewCanvas.height - 15 && vp.pos[1] < canvas.height - viewCanvas.height - 15);
}