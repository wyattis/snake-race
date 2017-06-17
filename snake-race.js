/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/*global Vue*/
	let RaceManager = __webpack_require__(1);
	let Game = __webpack_require__(3);

	const INIT_SPEED = 16;

	let controllers = {
	    'User 1' : {
	        Constructor: __webpack_require__(7),
	    },
	    'User 2' : {
	        Constructor: __webpack_require__(10),
	    },
	    'Simple AI': {
	        Constructor: __webpack_require__(11),
	    },
	    'A* AI': {
	        Constructor: __webpack_require__(13),
	    },
	    'Up Down AI': {
	        Constructor: __webpack_require__(14),
	    }
	};


	Vue.component('game', {
	    props: ['game'],
	    template: `<div class="game">
	        <div class="header">
	            <h2>{{game.name}}</h2>
	            <div class="stats">
	                Score: {{game.score}}, High Score: {{game.highScore}}
	            </div>
	        </div>
	    </div>`,
	    mounted: function(){
	        console.log('mounted', this.game.ctx);
	        this.$el.appendChild(this.game.ctx.canvas);
	    }
	});

	let race = new RaceManager(INIT_SPEED);
	new Vue({
	    el: '#snake-race',
	    data: {
	        controllers: controllers,
	        mapSize: {
	            width: 34,
	            height: 20,
	        },
	        speed: INIT_SPEED,
	        state: 'ready',
	        blockSize: 16,
	        players: [{
	            name: 'Player 1',
	            controller: controllers['User 1'].Constructor
	        }, {
	            name: 'Player 2',
	            controller: controllers['A* AI'].Constructor
	        }],
	        games: []
	    },
	    mounted: function(){
	        
	        for(let p of this.players){
	            let game = new Game(this.mapSize, this.blockSize, p.controller);
	            game.name = p.name;
	            race.addGame(game);
	            this.games.push(game);
	        }
	          
	    },
	    watch: {
	        race: function(){
	            console.log('computed state', this.race.state);
	            return this.race.state;
	        }
	    },
	    methods: {
	        start: function(){
	            
	            if(race.state !== 'ready')
	                return;
	            
	            race.resize(this.mapSize);
	            
	            // Create a game for each player
	            for(let i in this.games){
	                
	                let game = this.games[i];
	                let player = this.players[i];
	                
	                game.resize(this.mapSize, this.blockSize);
	                game.ControllerConstructor = player.controller;
	                game.reset({x: this.mapSize.width / 2, y: this.mapSize.height / 2});
	                
	            }
	            
	            race.start();
	            this.state = race.state;
	            
	        }
	    }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	let SignalManager = __webpack_require__(2);

	class RaceManager{
	    
	    constructor(speed){
	        
	        this.speed = speed;
	        this.mapSize = {width: 20, height: 20};
	        this.foodPositions = [];
	        this.stepCbs = [];
	        this.renderCbs = [];
	        this.signals = new SignalManager();
	        this.state = 'ready';
	        this.animationRequestId = null;
	        
	    }
	    
	    
	    resize(size){
	        
	        this.foodPositions = [];
	        this.mapSize.width = size.width;
	        this.mapSize.height = size.height;
	        
	    }
	    
	    
	    addStep(cb, context){
	        
	        if(context){
	            cb = cb.bind(context);
	        }
	        
	        this.stepCbs.unshift(cb);
	        
	    }
	    
	    addRender(cb, context){
	        
	        if(context){
	            cb = cb.bind(context);
	        }
	        
	        this.renderCbs.unshift(cb);
	        
	    }
	    
	    
	    /**
	     * Start the race. 
	     */
	    start(){
	        
	        this.update = this.update.bind(this);
	        this.lastTick = performance.now();
	        this.animationRequestId = requestAnimationFrame(this.update);
	        
	    }
	    
	    
	    /**
	     * The main loop. Called by requestAnimationFrame.
	     */
	    update(timestamp){
	        
	        if (!this.lastTick) {
	            this.lastTick = timestamp;
	        } 
	        
	        // Do multiple steps per frame if necessary. This should probably be based on time 
	        //  passed instead of the desired speed since it has the potential to really slow 
	        //  down if each step takes a long time
	        let stepCbIndex;
	        while(timestamp - this.lastTick >= 1000 / this.speed){
	            
	            // Emit each step callback
	            stepCbIndex = this.stepCbs.length;
	            while(stepCbIndex --){
	                this.stepCbs[stepCbIndex]();
	            }
	            
	            this.lastTick += 1000 / this.speed;
	        }
	        this.signals.tick(timestamp);
	        
	        // Emit each render callback
	        let renderCbIndex = this.renderCbs.length;
	        while(renderCbIndex --){
	            this.renderCbs[renderCbIndex]();
	        }
	        
	        this.animationRequestId = requestAnimationFrame(this.update);
	    }
	    

	    /**
	     * Reset the race
	     */
	    reset(){
	        
	        this.gameCount = 0;
	        this.lossCount = 0;
	        this.stepCbs = [];
	        this.renderCbs = [];
	        this.foodPositions = [];
	        
	    }
	    
	    
	    /**
	     * Get the food position for this index. If it doesn't exist yet then we
	     * create it.
	     * 
	     * @param {Integer} index - The index of the food we're getting
	     */
	    getFoodPos(index){
	        
	        // Create the food position at this index
	        if(!this.foodPositions[index]){
	            this.foodPositions[index] = {
	                x: Math.floor(Math.random() * this.mapSize.width),
	                y: Math.floor(Math.random() * this.mapSize.height),
	            };
	        }
	        
	        return this.foodPositions[index];
	        
	    }
	    
	    
	    /**
	     * Add a game to the race.
	     * 
	     * @param {Game} game - An instance of the Snake game
	     */
	    addGame(game){
	        
	        this.gameCount ++;
	        this.addStep(game.step, game);
	        this.addRender(game.render, game);
	        
	        // Keep track of losses
	        game.onLose = () => {
	            
	            this.lossCount ++;
	            console.log('losses', this.lossCount);
	            
	            if(this.lossCount === this.gameCount){
	                
	                this.state = 'lost';
	                
	            }
	            
	        };
	        
	        
	        // Get the next food from the stack
	        game.nextFoodPos = () => {
	            return this.getFoodPos(game.score / 100);
	        };
	        
	    }

	}

	module.exports = RaceManager;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	class SignalManager{
	    
	    constructor(){
	        this.signals = [];
	    }
	    
	    add(cb, timeout, context, timestamp){
	        this.signals.push({
	            cb: cb,
	            emitTime: (timestamp || performance.now()) + timeout,
	            context: context,
	        });
	    }
	    
	    tick(timestamp){
	        
	        let i = this.signals.length;
	        while(i--){
	            if(timestamp >= this.signals[i].emitTime){
	                let signal = this.signals.splice(i, 1)[0];
	                signal.cb.call(signal.context);
	            }
	        }
	        
	    }
	    
	}

	module.exports = SignalManager;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	let Snake = __webpack_require__(4);
	let Map = __webpack_require__(6);

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
	    
	    
	    
	    /**
	     * Get the next food position. This method is overidden in the view for the 
	     *  purpose of always having the food in the same position for both racers.
	     */
	    nextFoodPos(){
	        
	        return this.map.spawn();
	        
	    }
	    
	    
	    /**
	     * Reset the game by reseting all relevant properties and positions.
	     */
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

	    
	    /**
	     * Perform a single step of the game. It is possible to do any number of 
	     *  steps per render frame, but the pathfinding AIs will likely slow things
	     *  down in a big way.
	     */
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
	    
	    
	    /**
	     * Render a single frame of the game.
	     */
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	let DIR = __webpack_require__(5).DIR;

	class Snake {
	    
	    constructor(pos, startLength = 15, spacing = 1) {
	        
	        this.spacing = spacing;
	        this.moveQueue = [];
	        this.fillStyle = '#86BBD8';
	        this.direction = DIR.DOWN;
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
	                    case DIR.UP:
	                        this.vel.x = 0;
	                        this.vel.y = -1;
	                        break;
	                    case DIR.DOWN:
	                        this.vel.x = 0;
	                        this.vel.y = 1;
	                        break;
	                    case DIR.LEFT:
	                        this.vel.x = -1;
	                        this.vel.y = 0;
	                        break;
	                    case DIR.RIGHT:
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
	        this.direction = DIR.DOWN;
	        this.vel = { x: 0, y: 1 };
	        this.pos = pos;
	        this.fillStyle = '#86BBD8';
	        this.blocks = [];
	        for (let i = 0; i < this.startLength; i++) {
	            this.blocks.push({ x: pos.x - this.vel.x * i, y: pos.y - this.vel.y * i });
	        }
	        
	    }

	    up() {
	        this.moveQueue.push(DIR.UP);
	    }

	    left() {
	        this.moveQueue.push(DIR.LEFT);
	    }

	    down() {
	        this.moveQueue.push(DIR.DOWN);
	    }

	    right() {
	        this.moveQueue.push(DIR.RIGHT);
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

	module.exports = Snake;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = {
	    DIR: {LEFT: -1, RIGHT: 1, UP: 2, DOWN: -2},
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

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

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	let Controller = __webpack_require__(8);
	let Input = __webpack_require__(9);
	const DIR = __webpack_require__(5).DIR;

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

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * Base class for building user controller and AI based
	 * controllers. This class should only be extended.
	 */
	class Controller{
	    
	    constructor(snake, map){
	        
	        this.snake = snake; // reference to the snake
	        this.map = map;     // reference to the map
	        this.target;        // where we're trying to go
	        
	    }
	    
	    
	    /**
	     * Gets called for each step of the game
	     */
	    step(){}
	    
	    
	    /**
	     * Gets called when the target of the controller is
	     * changed.
	     * @param target - {x,y} position of the new target
	     */
	    moveTo(target){
	        
	        this.target = target;
	        
	    }
	    
	}

	module.exports = Controller;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	class Input{
	    constructor(){
	        
	        this.keys = {UP: 38, DOWN: 40, RIGHT: 39, LEFT: 37, SPACE: 32, A: 65, S: 83, W: 87, D: 68};
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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	let UserController = __webpack_require__(7);
	const DIR = __webpack_require__(5).DIR;

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	let AI = __webpack_require__(12);

	/**
	 * Simple AI will only look one block ahead and will try to minimize the L1 norm
	 * with each step. Highly susceptible to concave blockages, but also accidentally
	 * good at filling space.
	 */
	class SimpleAI extends AI{
	    
	    
	    /**
	     * Get the next available position that minimizes the L1Norm.
	     */
	    getMinL1(pos, dir, target){
	        
	        let adjascent = this.getAdjascent(pos, dir);
	        
	        // Sort from smallest L1 norm to largest. We will prioritize the
	        // smallest one.
	        adjascent.sort((a, b) => {
	            
	            return this.normL1(a, target) > this.normL1(b, target);
	            
	        });
	        
	        
	        // Loop through the adjascent cells and take the first one that it can
	        let move = adjascent.shift();
	        while(move){
	            
	            if(this.map.canMoveTo(move)){
	                
	                return move;
	                
	            }
	            
	            move = adjascent.shift();
	            
	        }
	        
	    }
	    
	    
	    /**
	     * Find the next move
	     */
	    updatePath(){
	        
	        let move = this.getMinL1(this.snake.pos, this.snake.direction, this.target);
	        if(move){
	            this.path.push(move);
	        }
	        
	    }
	    
	    
	    /**
	     * Single step of the game
	     */
	    step(){
	        
	        if(this.path.length === 0){
	            this.updatePath();
	        }
	        
	        this.move();
	        
	    }
	    
	}

	module.exports = SimpleAI;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	let Controller = __webpack_require__(8);
	let DIR = __webpack_require__(5).DIR;

	/**
	 * Base AI class to hold basic methods used by AI. To be extended only. 
	 */
	class AI extends Controller{
	    
	    constructor(snake, map){
	        super(snake, map);
	        
	        this.hasReachedTarget = false;
	        this.path = [];
	        
	    }

	    
	    /**
	     * Given to {x, y} positions return the direction of the snake
	     * @param pos - Start position
	     * @param target - End position
	     */
	    getDir(pos, target){
	        
	        let dx = target.x - this.snake.pos.x;
	        let dy = target.y - this.snake.pos.y;
	        if(dx > 0){
	            return DIR.RIGHT;
	        } else if (dx < 0){
	            return DIR.LEFT;
	        } else if (dy > 0){
	            return DIR.DOWN;
	        } else if (dy < 0){
	            return DIR.UP;
	        }
	        
	    }
	    
	    
	    /**
	     * Check if the path reaches the target or not.
	     * @returns Boolean
	     */
	    pathLeadsToTarget(){
	        
	        return this.path.length && this.path[this.path.length - 1].x === this.target.x && this.path[this.path.length - 1].y === this.target.y;
	        
	    }
	    
	    
	    /**
	     * Get valid adjascent cells. Cells that are in the opposite direction
	     * and cells that are outside the map boundaries are filtered out.
	     * @param pos - Position of current cell
	     * @param dir - Direction of travel at current cell
	     */
	    getAdjascent(pos, dir){
	            
	        let moves = [{
	            x: pos.x - 1, 
	            y: pos.y,
	            dir: DIR.LEFT    
	        },{
	            x: pos.x + 1, 
	            y: pos.y,
	            dir: DIR.RIGHT
	        },{
	            x: pos.x, 
	            y: pos.y + 1,
	            dir: DIR.DOWN
	        },{
	            x: pos.x, 
	            y: pos.y - 1,
	            dir: DIR.UP
	        }];

	        // Filter moves that the snake can't make
	        if(dir){
	            moves = moves.filter(move => move.dir + dir);
	        }

	        // Filter moves that are out of bounds
	        moves = moves.filter(move => this.map.isInMap(move));

	        return moves;

	    }
	    
	    
	    /**
	     * L1 or Manhattan norm between two points
	     * @param pos - Start position
	     * @param target - End position
	     */
	    normL1(pos, target){
	        
	        return Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y);
	        
	    }
	    
	    
	    
	    /**
	     * Make the next move in the path. This assumes that this.path holds the
	     *  path for the AI and that each element has a valid x and y property.
	     */
	    move(){
	        
	        let nextPos = this.path.shift();
	        
	        if(nextPos){
	            let dir = nextPos.dir || this.getDir(this.snake.pos, nextPos);
	            switch(dir){
	                case DIR.LEFT:
	                    this.snake.left();
	                    break;
	                case DIR.RIGHT:
	                    this.snake.right();
	                    break;
	                case DIR.DOWN:
	                    this.snake.down();
	                    break;
	                case DIR.UP:
	                    this.snake.up();
	                    break;
	            }
	        } else {
	            // console.log('no moves? About to lose or lost for some reason?')
	        }
	        
	    }
	    
	    
	    /**
	     * Assign the target and reset the path to be empty
	     * @param target - The x, y position we want to move to
	     */
	    moveTo(target){
	        
	        this.hasReachedTarget = false;
	        this.path = [];
	        this.target = target;
	        
	    }
	}

	module.exports = AI;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/*global astar Graph*/
	let AI = __webpack_require__(12);

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

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	let DIR = __webpack_require__(5).DIR;

	class UpDownAI{
	    
	    /**
	     * This AI will beat the game just by not allowing any gaps/holes in its movement. It will be super slow though.
	     */
	    constructor(snake, map){
	        this.snake = snake;
	        this.map = map;
	        this.offset = {top: 0, bottom: 0};
	        
	        if(this.map.bounds.width % 2 === 0){
	            if(this.snake.pos.x % 2 === 0){
	                this.offset.bottom = 1;
	            } else {
	                this.offset.top = 1;
	            }
	        } else {
	            this.offset.top = 1;
	            this.offset.bottom = 1;
	        }
	        
	        console.log('ai offset', this.offset);
	        
	        this.state = 'traversing';
	    }
	    
	    checkForTurn(){
	        
	        if(this.snake.direction === DIR.UP && !this.map.isInMap({x: this.snake.pos.x, y: this.snake.pos.y - 1 - this.offset.top})){
	            if(this.map.isInMap({x: this.snake.pos.x - 1, y: this.snake.pos.y})){
	                this.snake.left();
	                this.snake.down();
	            } else {
	                this.snake.up();
	                this.snake.right();
	                this.state = 'returning top';
	            }
	        } else if (this.snake.direction === DIR.DOWN && !this.map.isInMap({x: this.snake.pos.x, y: this.snake.pos.y + 1 + this.offset.bottom})){
	            if(this.map.isInMap({x: this.snake.pos.x - 1, y: this.snake.pos.y})){
	                this.snake.left();
	                this.snake.up();
	            } else {
	                this.snake.down();
	                this.snake.right();
	                this.state = 'returning bottom';
	            }
	        }      
	        
	    }    
	    
	    step(){
	        
	        if(this.state === 'traversing'){
	            // Make the up down motion
	            this.checkForTurn();
	        } else {
	            // Move in straight line at top or bottom of the map
	            if(!this.map.isInMap({x: this.snake.pos.x + 1, y: this.snake.pos.y})){
	                if(this.state === 'returning bottom'){
	                    this.snake.up();
	                } else {
	                    this.snake.down();
	                }
	                this.state = 'traversing';
	            }
	        }
	        
	        
	        
	    }
	    
	    enable(){}
	    disable(){}
	    moveTo(){}
	    
	}

	module.exports = UpDownAI;

/***/ })
/******/ ]);