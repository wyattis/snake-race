let SignalManager = require('./SignalManager.js');

class RaceManager{
    
    constructor(speed, numMaps){
        
        this.speed = speed;
        this.maps = [];
        this.stepCbs = [];
        this.renderCbs = [];
        this.signals = new SignalManager();
        this.generateMaps(numMaps);
        this.state = 'ready';
        this.animationRequestId = null;
        
    }
    
    
    generateMaps(num=10){
        
        // TODO:
        // for(let n=0; n<num; n++){
        //     this.maps.push({
        //         foodPos: 
        //     })
        // }
        
    }
    
    addStep(cb, context){
        
        if(context){
            cb = cb.bind(context);
        }
        
        this.stepCbs.unshift(cb);
        
    }
    
    addRender(cb, context){
        
        if(context){
            cb = cb.bind(context);
        }
        
        this.renderCbs.unshift(cb);
        
    }
    
    
    /**
     * Start the race. 
     */
    start(){
        
        this.update = this.update.bind(this);
        this.lastTick = performance.now();
        this.animationRequestId = requestAnimationFrame(this.update);
        
    }
    
    
    /**
     * The main loop. Called by requestAnimationFrame.
     */
    update(timestamp){
        
        if (!this.lastTick) {
            this.lastTick = timestamp;
        } 
        
        // Do multiple steps per frame if necessary. This should probably be based on time 
        //  passed instead of the desired speed since it has the potential to really slow 
        //  down if each step takes a long time
        let stepCbIndex;
        while(timestamp - this.lastTick >= 1000 / this.speed){
            
            // Emit each step callback
            stepCbIndex = this.stepCbs.length;
            while(stepCbIndex --){
                this.stepCbs[stepCbIndex]();
            }
            
            this.lastTick += 1000 / this.speed;
        }
        this.signals.tick(timestamp);
        
        // Emit each render callback
        let renderCbIndex = this.renderCbs.length;
        while(renderCbIndex --){
            this.renderCbs[renderCbIndex]();
        }
        
        this.animationRequestId = requestAnimationFrame(this.update);
    }

}

module.exports = RaceManager;