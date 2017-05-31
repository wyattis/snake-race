class Map{
    
    constructor(width, height){
        
        this.bounds = {left: 0, right: width, bottom: height, top: 0, width: width, height: height};
        this.nodes = [];
        this.resize(width, height);
        
    }
    
    canMoveTo(pos){
        
        return this.isInMap(pos) && !this.nodes[pos.y][pos.x];
        
    }
    
    
    isInMap(pos){
        
        return pos.y >= 0
               && pos.y < this.bounds.bottom
               && pos.x >= 0
               && pos.x < this.bounds.right;
        
    }
    
    
    /**
     * Move the map forward one step.
     */ 
    step(){
        
        let head = this.snake.blocks[0];
        let tail = this.snake.prevTail;
        if(head.x > -1 && head.y > -1 && head.x < this.bounds.width && head.y < this.bounds.height){
            this.nodes[head.y][head.x] = 1;
        }
        if(tail.x > -1 && tail.y > -1 && tail.x < this.bounds.width && tail.y < this.bounds.height){
            this.nodes[tail.y][tail.x] = 0;
        }
        
    }
    
    fill(){
        
        this.nodes = Array(this.bounds.height).fill(0).map(a => Array(this.bounds.width).fill(0));
        
    }
    
    resize(width, height){
        
        this.bounds.right = width;
        this.bounds.width = width;
        this.bounds.height = height;
        this.bounds.bottom = height;
        this.fill();
        
    }
    
    
    reset(snake){
        
        if(snake){
            this.snake = snake;
        }
        this.fill();
        for(let block of this.snake.blocks){
            if(block.x < this.bounds.width && block.x > -1 && block.y < this.bounds.height && block.y > -1){
                this.nodes[block.y][block.x] = 1;                
            }
        }
        
    }
    
    /**
     * Log the map to console
     */
    toString(){
        console.log(this.nodes.map(r => r.join(',') + '\n'));
    }
    
    /**
     * Spawn a new position that is valid in this map.
     */
    spawn(){
        
        let pos = {
            x : Math.floor(Math.random() * (this.bounds.right - this.bounds.left) + this.bounds.left),
            y : Math.floor(Math.random() * (this.bounds.bottom - this.bounds.top) + this.bounds.top)
        };
        
        // Respawn if we've made one that is invalid
        // TODO: Find a better way to get a valid move out of all of the valid moves. This could potentially 
        //  take 10s of thousands of attemps to find one.
        let safetyCounter = 0;
        while(!this.canMoveTo(pos) && safetyCounter < 1000){
            pos.x = Math.floor(Math.random() * (this.bounds.right - this.bounds.left) + this.bounds.left);
            pos.y = Math.floor(Math.random() * (this.bounds.bottom - this.bounds.top) + this.bounds.top);
            safetyCounter ++;
        }
        
        return pos;
        
    }
    
    
    invertedNodes(){
        
        return this.nodes.map(row => row.map(v => v === 0 ? 1 : 0));
        
    }
    
    
    graphNodes(){
        
        let newNodes = Array(this.bounds.width).fill(0).map(a => Array(this.bounds.height).fill(0));
        for(let x = 0; x < this.bounds.width; x ++){
            for(let y = 0; y < this.bounds.height; y ++){
                newNodes[x][y] = this.nodes[y][x] === 0 ? 1 : 0;
            }
        }
        
        return newNodes;
        
    }
    
}

module.exports = Map;