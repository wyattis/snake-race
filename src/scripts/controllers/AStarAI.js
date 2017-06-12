/*global astar Graph*/
let AI = require('./AI.js');

class AStarAI extends AI{
    
    /**
     * Use A* search method to look for optimal path. Uses this library
     * https://github.com/bgrins/javascript-astar
     */
    aStarPath(){
        
        let graph = new Graph(this.map.graphNodes());
        let start = graph.grid[this.snake.pos.x][this.snake.pos.y];
        let end = graph.grid[this.target.x][this.target.y];
        return astar.search(graph, start, end);
        
    }
    
    
    /**
     * This method is called when the SimpleAI detects a path length of 0
     */
    updatePath(){
        
        this.path = this.aStarPath();
        
    }
    
    
    /**
     * Handle a single step of the AI
     */
    step(){
        
        // How often to look for the optimal path
        if(this.path.length === 0 || this.stepsSinceLastUpdate > 4){
            this.stepsSinceLastUpdate = 0;
            this.updatePath();
        }
        this.stepsSinceLastUpdate ++;
        this.move();
        
    }
    
}

module.exports = AStarAI;