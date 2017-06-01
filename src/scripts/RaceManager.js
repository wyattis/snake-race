let SignalManager = require('./SignalManager.js');

class RaceManager{
    
    constructor(speed){
        
        this.speed = speed;
        this.mapSize = {width: 20, height: 20};
        this.foodPositions = [];
        this.stepCbs = [];
        this.renderCbs = [];
        this.signals = new SignalManager();
        this.state = 'ready';
        this.animationRequestId = null;
        
    }
    
    
    resize(size){
        this.mapSize.width = size.width;
        this.mapSize.height = size.height;
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
    

    /**
     * Reset the race
     */
    reset(){
        
        this.gameCount = 0;
        this.lossCount = 0;
        this.stepCbs = [];
        this.renderCbs = [];
        
    }
    
    
    /**
     * Get the food position for this index. If it doesn't exist yet then we
     * create it.
     * 
     * @param {Integer} index - The index of the food we're getting
     */
    getFoodPos(index){
        
        // Create the food position at this index
        if(!this.foodPositions[index]){
            this.foodPositions[index] = {
                x: Math.floor(Math.random() * this.mapSize.width),
                y: Math.floor(Math.random() * this.mapSize.height),
            };
        }
        
        return this.foodPositions[index];
        
    }
    
    
    /**
     * Add a game to the race.
     * 
     * @param {Game} game - An instance of the Snake game
     */
    addGame(game){
        
        this.gameCount ++;
        this.addStep(game.step, game);
        this.addRender(game.render, game);
        
        // Keep track of losses
        game.onLose = () => {
            
            this.lossCount ++;
            
            if(this.lossCount === this.gameCount){
                
                this.state = 'lost';
                
            }
            
        };
        
        
        // Get the next food from the stack
        game.nextFoodPos = () => {
            return this.getFoodPos(game.score / 100);
        };
        
    }

}

module.exports = RaceManager;