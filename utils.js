module.exports = {
	getRandomNum: function () {
		return Math.floor(Math.random() * 300);
	},

	garbageCollection: function (arr) {
		return arr.filter(function (elem) {
			return elem !== null;
		});
	}

	

}
