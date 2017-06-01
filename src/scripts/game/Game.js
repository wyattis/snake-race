let Snake = require('./Snake.js');
let Map = require('./Map.js');

class Game{
    
    constructor(size, blockSize, ControllerConstructor){
        
        this.state = 'created';
        this.highScore = 0;
        this.avgScore = 0;
        this.scores = [];
        this.steps = [];
        this.blockSize = blockSize;
        this.ctx = document.createElement('canvas').getContext('2d');
        this.ControllerConstructor = ControllerConstructor;
        this.onLose = () => {};
        
        this.map = new Map(size.width, size.height);
        this.snake = new Snake(this.map.spawn());
        this.map.reset(this.snake);
        this.reset();
        
    }
    
    
    /**
     * Resize the game to the specified dimensions
     */
    resize(size, blockSize){
        
        this.blockSize = blockSize;
        this.ctx.canvas.width = size.width * blockSize;
        this.ctx.canvas.height = size.height * blockSize;
        this.map.resize(size.width, size.height);
        
    }
    
    
    /**
     * Append the canvas to the supplied element
     * 
     * @param {HtmlDomElement} parent - The html element to append to
     */
    mount(parent){
        
        parent.appendChild(this.ctx.canvas);
        
    }
    
    
    nextFoodPos(){
        
        return this.map.spawn();
        
    }
    
    reset(snakePos){
        
        this.map.reset();
        snakePos = snakePos || this.map.spawn();
        this.score = 0;
        this.stepCount = 0;
        this.snake.reset(snakePos);
        this.food = this.nextFoodPos();
        this.controller = new this.ControllerConstructor(this.snake, this.map);
        this.controller.moveTo(this.food);
        this.state = 'running';
        this.map.reset();
        
    }

          
    step(){

        if(this.state === 'running'){            
            if(this.controller){
                this.controller.step();
            }
            this.snake.step();
            this.checkFood();
            this.checkCollision();
            this.map.step();
            this.stepCount ++;
        } else if (this.state === 'lost'){
            this.snake.fillStyle = 'red';
            this.snake.strokeStyle = 'blue';
        }
        
    }
    
    /**
     * Check if we've hit the food yet
     */
    checkFood(){
        
        if(this.food.x === this.snake.blocks[0].x 
           && this.food.y === this.snake.blocks[0].y){
            
            this.score += 100;
            this.snake.add();
            this.food = this.nextFoodPos();
            this.controller.moveTo(this.food);
            
        }
        
    }
    
    /**
     * We've lost. Schedule reset and do other lost stuff
     */
    lose(){
        
        this.scores.push(this.score);
        let sum = this.scores.reduce((a, b) => a + b);
        this.avgScore = Math.round(sum / this.scores.length);
        
        if(this.score > this.highScore){
            this.highScore = this.score;
        }
        this.state = 'lost';
        this.onLose();
        // this.signals.add(this.reset, this.speed > 60 ? 1000 * 60 / this.speed : 1000, this);
        
    }
    
    
    /**
     * Check for collisions with the boundaries of the map as well as each block in the snake.
     */
    checkCollision(){
                
        if(!this.map.canMoveTo(this.snake.pos)){
            
            this.lose();
            
        }
        
    }
    
    
    render(){
        
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.snake.render(this.ctx, this.blockSize);
        
        this.ctx.fillStyle = '#C33754';
        this.ctx.fillRect(this.food.x * this.blockSize, this.food.y * this.blockSize, this.blockSize, this.blockSize);
        
        
        // TODO: Draw the AI path as arrows 
        if(this.controller && this.controller.path){
            this.ctx.fillStyle = '#F6AE2D';
            for(let move of this.controller.path){
                this.ctx.fillRect(move.x * this.blockSize + this.blockSize / 4, move.y * this.blockSize + this.blockSize / 4, this.blockSize - this.blockSize / 2, this.blockSize - this.blockSize / 2);
            }
        }
        
    }
    
}

module.exports = Game;