const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamps');

const PlayerSchema = new mongoose.Schema({
    username: String,
    password: String,
    
    level: Number,

    position: String, // x,y

    energy: Number,
    hitpoints: Number,

    stats: [{
        name: String, // Attack
        description: String, // Affects your chance of landing an attack
    
        exp: Number, // No need for expToNextLevel or currentLevel, will have an algorithm for that,
        level: Number
    }],

    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    bank: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});

PlayerSchema.plugin(timestamps);

const PlayerModel = mongoose.model('Player', PlayerSchema);


module.exports = PlayerModel;

