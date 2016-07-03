var tilesMap = [];
var brightCactusMap = [];
var darkCactusMap = [];

function drawTiles (){
  for (var i = 0; i < canvas.width; i += 64){
    for (var j = 0; j < canvas.height; j+= 64){
        tilesMap.push({img: "img/desert1." + (Math.floor(Math.random() * 15) + 1) + ".png", x: i, y: j});
        if (j % 5 === 0 && Math.random() > 0.9) brightCactusMap.push({x: i, y: j}); //the if statement is for random location
        if (j % 6 === 0 && Math.random() < 0.1) darkCactusMap.push({x: i, y: j}); //the if statement is for random location
    }
  }
}

drawTiles();

function renderTerrain () {
    tilesMap.forEach(function(obj, index){
      ctx.fillStyle = ctx.drawImage(resources.get(obj.img), obj.x, obj.y);
    })

    darkCactusMap.forEach(function(obj){
      ctx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    })
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateCactuses(){
    brightCactusMap.forEach(function(obj){
      ctx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    })
}
