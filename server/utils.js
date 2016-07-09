module.exports = {
	//get a random number inclusive of both min and max -- min <= and <= max
	getRandomNum: function (min, max) {
		//if only one argument is given, argument will be max, min will be 0
		max = max || min;
		if (max === min) min = 0;
		return (min + Math.floor((Math.random() * max) + 1 - min ));
	},

	garbageCollection: function (arr) {
		return arr.filter(function (elem) {
			return elem !== null;
		});
	},

	inRange: function (num1, num2, num3, num4) {
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
}
