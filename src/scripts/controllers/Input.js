class Input{
    constructor(){
        
        this.keys = {UP: 38, DOWN: 40, RIGHT: 39, LEFT: 37, SPACE: 32};
        this.keyMem = {};
        for(let name in this.keys){
            this.keyMem[this.keys[name]] = {
                cbs: {up:[], down:[]},
                isDown: false
            };
        }
        
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
    }
    
    onDown(key, cb, context){
        
        if(context)
            cb = cb.bind(context);
        
        this.keyMem[key].cbs.down.push(cb);
        
    }
    
    onUp(key, cb, context){
        
        if(context)
            cb = cb.bind(context);
        
        this.keyMem[key].cbs.up.push(cb);
        
    }
    
    handleKeyDown(e){
        
        if(this.keyMem[e.keyCode] && !this.keyMem[e.keyCode].isDown){
            e.preventDefault();
            this.keyMem[e.keyCode].isDown = true;
            for(let cb of this.keyMem[e.keyCode].cbs.down)
                cb(e);
        }

    }
    
    handleKeyUp(e){
        
        if(this.keyMem[e.keyCode]){
            e.preventDefault();
            this.keyMem[e.keyCode].isDown = false;
            for(let cb of this.keyMem[e.keyCode].cbs.up)
                cb(e);
        }
        
    }
}

module.exports = Input;