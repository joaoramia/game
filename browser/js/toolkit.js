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
  return (e.layerX < 30 && vp.pos[0] > 30);
}

function xMaxLimit (e) {
  return (e.layerX >= viewCanvas.width - 30 && vp.pos[0] < canvas.width - viewCanvas.width - 30);
}

function yMinLimit (e) {
  return (e.layerY < 30 && vp.pos[1] > 30);
}

function yMaxLimit (e) {
  return (e.layerY >= viewCanvas.height - 30 && vp.pos[1] < canvas.height - viewCanvas.height - 30);
}