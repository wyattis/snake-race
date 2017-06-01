/*global Vue*/
let RaceManager = require('./RaceManager.js');
let Game = require('./game/Game.js');

const INIT_SPEED = 16;

let controllers = {
    'User 1' : {
        Constructor: require('./controllers/UserController.js'),
    },
    'User 2' : {
        Constructor: require('./controllers/User2Controller.js'),
    },
    'Simple AI': {
        Constructor: require('./controllers/SimpleAI.js'),
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

module.exports = new Vue({
    el: '#snake-race',
    data: {
        controllers: controllers,
        speed: INIT_SPEED,
        mapSize: {
            width: 34,
            height: 20,
        },
        blockSize: 16,
        players: [{
            name: 'Player 1',
            controller: controllers['User 1'].Constructor
        }, {
            name: 'Player 2',
            controller: controllers['User 2'].Constructor
        }],
        games: [],
        race: new RaceManager(INIT_SPEED),
    },
    mounted: function(){
        
        for(let p of this.players){
            let game = new Game(this.mapSize, this.blockSize, p.controller);
            game.name = p.name;
            this.race.addGame(game);
            this.games.push(game);
        }
          
    },
    methods: {
        start: function(){
            
            if(this.race.state !== 'ready')
                return;
            
            this.race.resize(this.mapSize);
            
            // Create a game for each player
            for(let i in this.games){
                
                let game = this.games[i];
                let player = this.players[i];
                
                game.resize(this.mapSize, this.blockSize);
                game.ControllerConstructor = player.controller;
                game.reset({x: this.mapSize.width / 2, y: this.mapSize.height / 2});
                
            }
            
            this.race.start();
            
        }
    }
});