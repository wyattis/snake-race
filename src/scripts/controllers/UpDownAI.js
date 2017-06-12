let DIR = require('../Enums.js').DIR;

class UpDownAI{
    
    /**
     * This AI will beat the game just by not allowing any gaps/holes in its movement. It will be super slow though.
     */
    constructor(snake, map){
        this.snake = snake;
        this.map = map;
        this.offset = {top: 0, bottom: 0};
        
        if(this.map.bounds.width % 2 === 0){
            if(this.snake.pos.x % 2 === 0){
                this.offset.bottom = 1;
            } else {
                this.offset.top = 1;
            }
        } else {
            this.offset.top = 1;
            this.offset.bottom = 1;
        }
        
        console.log('ai offset', this.offset);
        
        this.state = 'traversing';
    }
    
    checkForTurn(){
        
        if(this.snake.direction === DIR.UP && !this.map.isInMap({x: this.snake.pos.x, y: this.snake.pos.y - 1 - this.offset.top})){
            if(this.map.isInMap({x: this.snake.pos.x - 1, y: this.snake.pos.y})){
                this.snake.left();
                this.snake.down();
            } else {
                this.snake.up();
                this.snake.right();
                this.state = 'returning top';
            }
        } else if (this.snake.direction === DIR.DOWN && !this.map.isInMap({x: this.snake.pos.x, y: this.snake.pos.y + 1 + this.offset.bottom})){
            if(this.map.isInMap({x: this.snake.pos.x - 1, y: this.snake.pos.y})){
                this.snake.left();
                this.snake.up();
            } else {
                this.snake.down();
                this.snake.right();
                this.state = 'returning bottom';
            }
        }      
        
    }    
    
    step(){
        
        if(this.state === 'traversing'){
            // Make the up down motion
            this.checkForTurn();
        } else {
            // Move in straight line at top or bottom of the map
            if(!this.map.isInMap({x: this.snake.pos.x + 1, y: this.snake.pos.y})){
                if(this.state === 'returning bottom'){
                    this.snake.up();
                } else {
                    this.snake.down();
                }
                this.state = 'traversing';
            }
        }
        
        
        
    }
    
    enable(){}
    disable(){}
    moveTo(){}
    
}

module.exports = UpDownAI;