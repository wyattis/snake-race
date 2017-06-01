let AI = require('./AI.js');

/**
 * Simple AI will only look one block ahead and will try to minimize the L1 norm
 * with each step. Highly susceptible to concave blockages, but also accidentally
 * good at filling space.
 */
class SimpleAI extends AI{
    
    
    /**
     * Get the next available position that minimizes the L1Norm.
     */
    getMinL1(pos, dir, target){
        
        let adjascent = this.getAdjascent(pos, dir);
        
        // Sort from smallest L1 norm to largest. We will prioritize the
        // smallest one.
        adjascent.sort((a, b) => {
            
            return this.normL1(a, target) > this.normL1(b, target);
            
        });
        
        
        // Loop through the adjascent cells and take the first one that it can
        let move = adjascent.shift();
        while(move){
            
            if(this.map.canMoveTo(move)){
                
                return move;
                
            }
            
            move = adjascent.shift();
            
        }
        
    }
    
    
    /**
     * Find the next move
     */
    updatePath(){
        
        let move = this.getMinL1(this.snake.pos, this.snake.direction, this.target);
        if(move){
            this.path.push(move);
        }
        
    }
    
    
    /**
     * Single step of the game
     */
    step(){
        
        if(this.path.length === 0){
            this.updatePath();
        }
        
        this.move();
        
    }
    
}

module.exports = SimpleAI;