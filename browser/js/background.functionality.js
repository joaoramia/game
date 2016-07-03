var tilesMap = [];
var brightCactusMap = [];
var darkCactusMap = [];
var tempCanvas;
var tempCtx;
var alreadyRendered = false;
tempCanvas = document.createElement("canvas");
tempCtx = tempCanvas.getContext('2d');
tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;

function drawTiles (){
  for (var i = 0; i < canvas.width; i += 64){
    for (var j = 0; j < canvas.height; j+= 64){
        tilesMap.push({img: "img/desert1." + (Math.floor(Math.random() * 15) + 1) + ".png", x: i, y: j});
        if (j % 5 === 0 && Math.random() > 0.9) brightCactusMap.push({x: i, y: j}); //the if statement is for random location
        if (j % 6 === 0 && Math.random() < 0.1) darkCactusMap.push({x: i, y: j}); //the if statement is for random location
    }
  }
}

// drawTiles();

function renderTerrain () {

    for (var i = 0; i < canvas.width; i += 64){
      for (var j = 0; j < canvas.height; j+= 64){
          // tilesMap.push({img: "img/desert1." + (Math.floor(Math.random() * 15) + 1) + ".png", x: i, y: j});
          var rand = 'img/desert1.' + (Math.floor(Math.random() * 15) + 1) + ".png";
          ctx.fillStyle = ctx.drawImage(resources.get(rand), i, j);
          tempCtx.fillStyle = tempCtx.drawImage(resources.get(rand), i, j);
          if (j % 5 === 0 && Math.random() > 0.9) brightCactusMap.push({x: i, y: j}); //the if statement is for random location
          if (j % 6 === 0 && Math.random() < 0.1) {
            ctx.drawImage(resources.get('img/cactus.png'), i, j);
            tempCtx.drawImage(resources.get('img/cactus.png'), i, j);
          }
      }
    }


    // tilesMap.forEach(function(obj){
    //   ctx.fillStyle = ctx.drawImage(resources.get(obj.img), obj.x, obj.y);
    //   tempCtx.fillStyle = tempCtx.drawImage(resources.get(obj.img), obj.x, obj.y);
    // })
    //
    // darkCactusMap.forEach(function(obj){
    //   ctx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    //   tempCtx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    // })

    alreadyRendered = true;
}

function generateCactuses(){
    brightCactusMap.forEach(function(obj){
      ctx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
      tempCtx.drawImage(resources.get('img/cactus.png'), obj.x, obj.y);
    })
}
