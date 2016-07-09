function commaSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortPlayersPositions(obj){
	var sortable = [];
	for (var id in obj) {
		sortable.push([id, obj[id].wealth]);
		sortable.sort(function(a, b) {
		        return a[1] - b[1]
		    }
		);
	}
}