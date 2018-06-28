const mongoose = require('mongoose');

const NPC = new mongoose.Schema({
    name: String, // Bob
    level: Number,
    hitpoints: Number,

    position: String, // x,y

    attackable: Boolean,
    canTalkTo: Boolean,

    stats: [{
        name: String, // Attack
        description: String, // Affects your chance of landing an attack
    
        exp: Number, // No need for expToNextLevel or currentLevel, will have an algorithm for that,
        level: Number
    }],
    
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
});

const NPCModel = mongoose.model('NPC', NPC);

module.exports = NPCModel;