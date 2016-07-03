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
	}
}
