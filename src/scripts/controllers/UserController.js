let Controller = require('./Controller.js');
let Input = require('./Input.js');
const DIR = require('../Enums.js').DIR;

class UserController extends Controller{
    
    constructor(snake, map){
        
        super(snake, undefined);
        this.input = new Input();
        this.keyMap = {};
        this.setupKeyMap();
        this.inputQueue = [];
        this.setupInput();
        
    }
    
    
    /**
     * Setup the keymap. This is a seperate function to make this class more
     * extensible.
     */
    setupKeyMap(){
        
        this.keyMap[DIR.DOWN] = this.input.keys.DOWN;
        this.keyMap[DIR.UP] = this.input.keys.UP;
        this.keyMap[DIR.RIGHT] = this.input.keys.RIGHT;
        this.keyMap[DIR.LEFT] = this.input.keys.LEFT;
        
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
        
        let assignInput = (key, direction) => {
            this.input.onDown(key, e => {
                console.log(e.keyCode, direction);
                this.inputQueue.push(direction);
            });
        };
        
        for(let direction in this.keyMap){
            assignInput(this.keyMap[direction], +direction);
        }


    }
    
}

module.exports = UserController;