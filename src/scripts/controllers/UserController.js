let Controller = require('./Controller.js');
let Input = require('./Input.js');
const DIR = {DOWN: 0, UP: 1, LEFT: 2, RIGHT: 3};

class UserController extends Controller{
    
    constructor(snake, map){
        
        super(snake, undefined);
        this.input = new Input();
        this.inputQueue = [];
        this.setupInput();
        
    }
    
    /**
     * Handle a single step of the game. If the user 
     *  has supplied any input then we provide that to
     *  the snake. Otherwise, we do nothing.
     */
    step(){
        
        let nextInput = this.inputQueue.shift();
        if(nextInput !== undefined){
            switch(nextInput){
                case DIR.DOWN:
                    this.snake.down();
                    break;
                case DIR.UP:
                    this.snake.up();
                    break;
                case DIR.LEFT:
                    this.snake.left();
                    break;
                case DIR.RIGHT:
                    this.snake.right();
                    break;
            }
        }
        
    }
    
    setupInput(){
        
        this.input.onDown(this.input.keys.DOWN, e => {
            this.inputQueue.push(DIR.DOWN);
        });
        this.input.onDown(this.input.keys.LEFT, e => {
            this.inputQueue.push(DIR.LEFT);
        });
        this.input.onDown(this.input.keys.RIGHT, e => {
            this.inputQueue.push(DIR.RIGHT);
        });
        this.input.onDown(this.input.keys.UP, e => {
            this.inputQueue.push(DIR.UP);
        });

    }
    
}

module.exports = UserController;