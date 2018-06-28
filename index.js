const mongoose = require('mongoose');
const Lively = require('./Lively');

const Game = require('./game/Game');


mongoose.connect(`mongodb://localhost:27017/textscape`);

const app = new Lively({
    expressOpts: { port: 8000 },
    mongoose: mongoose,
    schemasPath: __dirname + "/schemas", 
    actionsPath: __dirname + "/actions"
});

const game = new Game(app);

app.addService('Game', game);