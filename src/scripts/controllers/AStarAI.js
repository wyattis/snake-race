/*global astar Graph*/
let SimpleAI = require('./SimpleAI.js');

class AStarAI extends SimpleAI{
    
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
    
}

module.exports = AStarAI;