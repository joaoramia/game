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