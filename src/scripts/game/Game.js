let Snake = require('./Snake.js');
let Map = require('./Map.js');

class Game{
    
    constructor(ctx, w, h, size = 20, ControllerConstructor){
        
        this.state = 'created';
        this.highScore = 0;
        this.avgScore = 0;
        this.scores = [];
        this.steps = [];
        this.ctx = ctx;
        this.size = size;
        this.ControllerConstructor = ControllerConstructor;
        this.onLose = () => {};
        
        this.map = new Map(w, h);
        this.snake = new Snake(this.map.spawn());
        this.map.reset(this.snake);
        this.reset();
        
    }    
    
    reset(snakePos, foodPos){
        
        this.map.reset();
        snakePos = snakePos || this.map.spawn();
        foodPos = foodPos || this.map.spawn();
        this.score = 0;
        this.stepCount = 0;
        this.snake.reset(snakePos);
        this.food = this.map.spawn();
        this.controller = new this.ControllerConstructor(this.snake, this.map);
        console.log('initial map:', this.map.toString());
        this.state = 'running';
        this.map.reset();
        
    }

    start(){
        
        this.state = 'running';
        
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
            
            this.food = this.map.spawn();
            this.snake.add();
            this.controller.moveTo(this.food);
            this.score += 100;
            
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
        this.snake.render(this.ctx, this.size);
        
        this.ctx.fillStyle = '#C33754';
        this.ctx.fillRect(this.food.x * this.size, this.food.y * this.size, this.size, this.size);
        
        
        // TODO: Draw the AI path as arrows 
        if(this.controller && this.controller.path){
            this.ctx.fillStyle = '#F6AE2D';
            for(let move of this.controller.path){
                this.ctx.fillRect(move.x * this.size + this.size / 4, move.y * this.size + this.size / 4, this.size - this.size / 2, this.size - this.size / 2);
            }
        }
        
    }
    
}

module.exports = Game;