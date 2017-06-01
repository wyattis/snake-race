let UserController = require('./UserController.js');
const DIR = require('../Enums.js').DIR;

class User2Controller extends UserController{
    
    /**
     * Assign to WASD instead of cursors
     */
    setupKeyMap(){
        
        this.keyMap[DIR.DOWN] = this.input.keys.S;
        this.keyMap[DIR.UP] = this.input.keys.W;
        this.keyMap[DIR.RIGHT] = this.input.keys.D;
        this.keyMap[DIR.LEFT] = this.input.keys.A;
        
    }
    
}

module.exports = User2Controller;