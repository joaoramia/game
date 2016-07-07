var fps = { 
    startTime : 0,  
    frameNumber : 0,    
    getFPS : function () {
        this.frameNumber++;     
        var d = new Date().getTime(),
            currentTime = ( d - this.startTime ) / 1000,
            result = Math.floor( ( this.frameNumber / currentTime ) );

        if( currentTime > 1 ){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }       
        return result;
    }   
};


var currentFPS;

function calculateFPS () {
    currentFPS = fps.getFPS();
    document.getElementById('currentFPS').innerText = currentFPS;
}