let Controller = require('./Controller.js');
let DIR = require('../Enums.js').DIR;

/**
 * Base AI class to hold basic methods used by AI. To be extended only. 
 */
class AI extends Controller{
    
    constructor(snake, map){
        super(snake, map);
        
        this.hasReachedTarget = false;
        this.path = [];
        
    }

    
    /**
     * Given to {x, y} positions return the direction of the snake
     * @param pos - Start position
     * @param target - End position
     */
    getDir(pos, target){
        
        let dx = target.x - this.snake.pos.x;
        let dy = target.y - this.snake.pos.y;
        if(dx > 0){
            return DIR.RIGHT;
        } else if (dx < 0){
            return DIR.LEFT;
        } else if (dy > 0){
            return DIR.DOWN;
        } else if (dy < 0){
            return DIR.UP;
        }
        
    }
    
    
    /**
     * Check if the path reaches the target or not.
     * @returns Boolean
     */
    pathLeadsToTarget(){
        
        return this.path.length && this.path[this.path.length - 1].x === this.target.x && this.path[this.path.length - 1].y === this.target.y;
        
    }
    
    
    /**
     * Get valid adjascent cells. Cells that are in the opposite direction
     * and cells that are outside the map boundaries are filtered out.
     * @param pos - Position of current cell
     * @param dir - Direction of travel at current cell
     */
    getAdjascent(pos, dir){
            
        let moves = [{
            x: pos.x - 1, 
            y: pos.y,
            dir: DIR.LEFT    
        },{
            x: pos.x + 1, 
            y: pos.y,
            dir: DIR.RIGHT
        },{
            x: pos.x, 
            y: pos.y + 1,
            dir: DIR.DOWN
        },{
            x: pos.x, 
            y: pos.y - 1,
            dir: DIR.UP
        }];

        // Filter moves that the snake can't make
        if(dir){
            moves = moves.filter(move => move.dir + dir);
        }

        // Filter moves that are out of bounds
        moves = moves.filter(move => this.map.isInMap(move));

        return moves;

    }
    
    
    /**
     * L1 or Manhattan norm between two points
     * @param pos - Start position
     * @param target - End position
     */
    normL1(pos, target){
        
        return Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y);
        
    }
    
    
    
    /**
     * Make the next move in the path. This assumes that this.path holds the
     *  path for the AI and that each element has a valid x and y property.
     */
    move(){
        
        let nextPos = this.path.shift();
        
        if(nextPos){
            let dir = nextPos.dir || this.getDir(this.snake.pos, nextPos);
            switch(dir){
                case DIR.LEFT:
                    this.snake.left();
                    break;
                case DIR.RIGHT:
                    this.snake.right();
                    break;
                case DIR.DOWN:
                    this.snake.down();
                    break;
                case DIR.UP:
                    this.snake.up();
                    break;
            }
        } else {
            // console.log('no moves? About to lose or lost for some reason?')
        }
        
    }
    
    
    /**
     * Assign the target and reset the path to be empty
     * @param target - The x, y position we want to move to
     */
    moveTo(target){
        
        this.hasReachedTarget = false;
        this.path = [];
        this.target = target;
        
    }
}

module.exports = AI;