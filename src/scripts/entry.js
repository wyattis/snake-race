let RaceManager = require('./RaceManager.js');
let Game = require('./game/Game.js');
let UserController = require('./controllers/UserController.js');

const BLOCK_SIZE = 16;
let size = {x: 34, y: 20};
let games = [{
    canvas: 'player-one-canvas', 
    stats: 'player-one-stats', 
    ControllerConstructor: UserController
},{
    canvas: 'player-two-canvas',
    stats: 'player-two-stats',
    ControllerConstructor: UserController
}];

let race = new RaceManager(16, 10);
for(let g of games){
    
    let ctx = document.getElementById(g.canvas).getContext("2d");
    ctx.canvas.width = size.x * BLOCK_SIZE;
    ctx.canvas.height = size.y * BLOCK_SIZE;
    let snake = new Game(ctx, size.x, size.y, BLOCK_SIZE, g.ControllerConstructor);
    race.addGame(snake);
    
    
    let statsDiv = document.getElementById(g.stats);
    let score = document.createElement('div');
    let avgScore = document.createElement('div');
    let highScore = document.createElement('div');
    let numGames = document.createElement('div');
    statsDiv.appendChild(score);
    statsDiv.appendChild(avgScore);
    statsDiv.appendChild(highScore);
    statsDiv.appendChild(numGames);
    
    // TODO: Add our render callback to update the scores
    race.addRender(function(){
        score.innerHTML = "Score: " + snake.score;
        avgScore.innerHTML = `Average: ${snake.scores.length ? Math.round(snake.scores.reduce((a, b) => a + b) / snake.scores.length) : 0}`;
        highScore.innerHTML = `High Score: ${snake.highScore || snake.score}`;
        numGames.innerHTML = `# Games: ${snake.scores.length}`;
    });
    
}