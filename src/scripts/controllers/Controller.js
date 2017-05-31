/**
 * Base class for building user controller and AI based
 * controllers. This class should only be extended.
 */
class Controller{
    
    constructor(snake, map){
        
        this.snake = snake; // reference to the snake
        this.map = map;     // reference to the map
        this.target;        // where we're trying to go
        
    }
    
    
    /**
     * Gets called for each step of the game
     */
    step(){}
    
    
    /**
     * Gets called when the target of the controller is
     * changed.
     * @param target - {x,y} position of the new target
     */
    moveTo(target){
        
        this.target = target;
        
    }
    
}

module.exports = Controller;