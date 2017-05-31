class Snake {
    
    constructor(pos, startLength = 15, spacing = 1) {
        
        this.spacing = spacing;
        this.moveQueue = [];
        this.fillStyle = '#86BBD8';
        this.direction = Snake.DIR.DOWN;
        this.pos = pos;
        this.vel = { x: 0, y: 1 };
        this.startLength = startLength;
        this.reset(pos);
        
    }
    
    step() {
        // Get the next input from the inputStack
        let nextDirection = this.moveQueue.shift();
        if (nextDirection) {
            // Counterintuitive but these verify that we aren't doing the same move
            //  and that we aren't going directly in the opposite direction.
            //  For example: UP: 1, DOWN: -1 --> 1 - 1 === 0 && 1 + (-1) === 0
            if (nextDirection + this.direction && nextDirection - this.direction) {
                switch (nextDirection) {
                    case Snake.DIR.UP:
                        this.vel.x = 0;
                        this.vel.y = -1;
                        break;
                    case Snake.DIR.DOWN:
                        this.vel.x = 0;
                        this.vel.y = 1;
                        break;
                    case Snake.DIR.LEFT:
                        this.vel.x = -1;
                        this.vel.y = 0;
                        break;
                    case Snake.DIR.RIGHT:
                        this.vel.x = 1;
                        this.vel.y = 0;
                        break;
                }
                this.direction = nextDirection;
            }
        }
        
        // Save the tail position
        this.prevTail = {x: this.blocks[this.blocks.length - 1].x, y: this.blocks[this.blocks.length - 1].y};
        
        // Update the position of each block
        let i = this.blocks.length;
        while (i--) {
            if (i !== 0) {
                this.blocks[i].x = this.blocks[i - 1].x;
                this.blocks[i].y = this.blocks[i - 1].y;
            } else {
                this.pos.x += this.vel.x;
                this.pos.y += this.vel.y;
                this.blocks[i].x = this.pos.x;
                this.blocks[i].y = this.pos.y;
            }
        }
        
    }
    
    reset(pos){
        
        this.moveQueue = [];
        this.direction = Snake.DIR.DOWN;
        this.vel = { x: 0, y: 1 };
        this.pos = pos;
        this.fillStyle = '#86BBD8';
        this.blocks = [];
        for (let i = 0; i < this.startLength; i++) {
            this.blocks.push({ x: pos.x - this.vel.x * i, y: pos.y - this.vel.y * i });
        }
        
    }

    up() {
        this.moveQueue.push(Snake.DIR.UP);
    }

    left() {
        this.moveQueue.push(Snake.DIR.LEFT);
    }

    down() {
        this.moveQueue.push(Snake.DIR.DOWN);
    }

    right() {
        this.moveQueue.push(Snake.DIR.RIGHT);
    }

    add(num = 1) {
        while (num--) {
            let block = Object.assign({}, this.blocks[this.blocks.length - 1]);
            block.x -= this.vel.x;
            block.y -= this.vel.y;
            this.blocks.push(block);
        }
    }

    render(ctx, size) {
        ctx.fillStyle = this.fillStyle;
        let i = this.blocks.length;
        while (i--) {
            ctx.fillRect(this.blocks[i].x * size + this.spacing, this.blocks[i].y * size + this.spacing, size - 2*this.spacing, size - 2*this.spacing);
        }
        ctx.fillStyle = "black";
        ctx.fillRect(this.blocks[0].x * size + this.spacing + 1, this.blocks[0].y * size + this.spacing + 1, size - 2*(this.spacing + 1), size - 2*(this.spacing + 1));
    }
    
}
Snake.DIR = { DOWN: -1, UP: 1, LEFT: -2, RIGHT: 2 };

module.exports = Snake;