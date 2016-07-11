
//from the sprites for the units we used, the soldier has the largest size (64x64), so this was the tile size chosen for the world
var tileWidth = spriteSizes['soldier'][0];
var tileHeight = spriteSizes['soldier'][1];
var barTileWidth = spriteSizes['bar'][0];
var barTileWidth = spriteSizes['bar'][1];
var barTileWidth = spriteSizes['house'][0];
var houseTileWidth = spriteSizes['house'][1];

var worldWidth = Math.floor(canvas.width/tileWidth);
var worldHeight = Math.floor(canvas.width/tileHeight);

var pathStart = [worldWidth, worldHeight];
var pathEnd = [0,0];
var currentPath = [];

var world = [[]];

var mouseTargetLocation = [];

var walkableTile = 0;

var worldSize = worldWidth * worldHeight;

function getPointFromTile (tile){
	var x = 0;
	var y = 0;
	if (tile[0] > 0) {
		x = (tile[0]) * tileWidth;
	}
	if (tile[1] > 0) {
		y = (tile[1]) * tileHeight;
	}
	return [x, y];
}

function getTileFromPoint (point){
	var x = Math.floor(point[0]/tileWidth);
	var y = Math.floor(point[1]/tileHeight);
	return [x, y];
}

function buildingTiles (location, type) {
  var buildingTilesHorizontal = Math.round(spriteSizes[type][0]/tileWidth);
  var buildingTilesVertical = Math.round(spriteSizes[type][1]/tileHeight);
  var result = [[Math.round(location[0]/tileWidth), Math.round(location[1]/tileHeight)]];
  for (var w = 0; w < buildingTilesHorizontal; w++){
    for (var h = 0; h < buildingTilesVertical; h++){
        if (w === 0 && h === 0) continue;
        result.push([result[0][0] + w, result[0][1] + h]);
    }
  }
  return result;
}

//creating an empty world:
function createWorld(){
	for (var w = 0; w < worldWidth; w++){
		world[w] = [];
		for (var h = 0; h < worldHeight; h++){
			world[w][h] = 0;
		}
	}
}

createWorld();

//finally the a-star algorithm
function findPath(world, start, end){
	var abs = Math.abs;
	var max = Math.max;
	var pow = Math.pow;
	var sqrt = Math.sqrt;

	return calculatePath(start, end);

}

function EuclideanDistance(point, goal){
	return Math.sqrt(Math.pow(point.x - goal.x, 2) + Math.pow(point.y - goal.y, 2));
}

function Neighbours(x, y){
	var N = y - 1,
		S = y + 1,
		E = x + 1,
		W = x - 1,
		myN = N > -1 && canWalkHere(x, N),
		myS = S < worldHeight && canWalkHere(x, S),
		myE = E < worldWidth && canWalkHere(E, y),
		myW = W > -1 && canWalkHere(W, y),
		result = [];
	
	if(myN) result.push({x:x, y:N});
	if(myE)	result.push({x:E, y:y});
	if(myS)	result.push({x:x, y:S});
	if(myW)	result.push({x:W, y:y});
	DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result);
	return result;
}

function DiagonalNeighbours(myN, myS, myE, myW, N, S, E, W, result){
	if(myN) {
		if(myE && canWalkHere(E, N))
		result.push({x:E, y:N});
		if(myW && canWalkHere(W, N))
		result.push({x:W, y:N});
	}
	if(myS)	{
		if(myE && canWalkHere(E, S))
		result.push({x:E, y:S});
		if(myW && canWalkHere(W, S))
		result.push({x:W, y:S});
	}
}

function canWalkHere(x, y){
	return ((world[x] !== null) && (world[x][y] !== null) && (world[x][y] <= walkableTile));
};

//we create a linked list to store the potential paths with nodes:
function Node(Parent, Point){
	var newNode = {
		// pointer to another Node object
		Parent:Parent,
		// array index of this Node in the world linear array
		value:Point.x + (Point.y * worldWidth),
		// the location coordinates of this Node
		x:Point.x,
		y:Point.y,
		// the distanceFunction cost to get
		// to this Node from the START
		f:0,
		// the distanceFunction cost to get
		// from this Node to the GOAL
		g:0
	};
	return newNode;
}

// Path function, executes AStar algorithm operations
function calculatePath(start, end) {
	// create Nodes from the Start and End x,y coordinates
	var	mypathStart = Node(null, {x:start[0], y:start[1]});
	var mypathEnd = Node(null, {x:end[0], y:end[1]});
	// create an array that will contain all world cells
	var AStar = new Array(worldSize);
	// list of currently open Nodes
	var Open = [mypathStart];
	// list of closed Nodes
	var Closed = [];
	// list of the final output array
	var result = [];
	// reference to a Node (that is nearby)
	var myNeighbours;
	// reference to a Node (that we are considering now)
	var myNode;
	// reference to a Node (that starts a path in question)
	var myPath;
	// temp integer variables used in the calculations
	var length, max, min, i, j;
	// iterate through the open list until none are left
	
	while(length = Open.length)
	{
		max = worldSize;
		min = -1;
		for(var i = 0; i < length; i++)
		{
			if(Open[i].f < max)
			{
				max = Open[i].f;
				min = i;
			}
		}
		// grab the next node and remove it from Open array
		myNode = Open.splice(min, 1)[0];
		// is it the destination node?
		if(myNode.value === mypathEnd.value)
		{
			myPath = Closed[Closed.push(myNode) - 1];
			do
			{
				result.push([myPath.x, myPath.y]);
			}
			while (myPath = myPath.Parent);
			// clear the working arrays
			AStar = Closed = Open = [];
			// we want to return start to finish
			result.reverse();
		}
		else // not the destination
		{
			// find which nearby nodes are walkable
			myNeighbours = Neighbours(myNode.x, myNode.y);
			// test each one that hasn't been tried already
			for(i = 0, j = myNeighbours.length; i < j; i++)
			{
				myPath = Node(myNode, myNeighbours[i]);
				if (!AStar[myPath.value])
				{
					// estimated cost of this particular route so far
					myPath.g = myNode.g + EuclideanDistance(myNeighbours[i], myNode);
					// estimated cost of entire guessed route to the destination
					myPath.f = myPath.g + EuclideanDistance(myNeighbours[i], mypathEnd);
					// remember this new path for testing above
					Open.push(myPath);
					// mark this node in the world graph as visited
					AStar[myPath.value] = true;
				}
			}
			// remember this route as having no more untested options
			Closed.push(myNode);
		}
	} // keep iterating until until the Open list is empty
	return result;
}
