const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const NPC = new mongoose.Schema({
    name: String, // Bob
    level: Number,

    attackable: Boolean,
    canTalkTo: Boolean,

    respawnInterval: Number, // seconds

    stats: [{ type: mongoose.Schema.Types.ObjectId, ref: "StatProgress", autopopulate: true }],
    
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem" }],
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem" }],

    dropTable: [
        {
            item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
            chance: Number // chance / 100000
        }
    ]
});

NPC.plugin(autopopulate);

const NPCModel = mongoose.model('NPC', NPC);

module.exports = NPCModel;