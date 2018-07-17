const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamps');
const autopopulate = require('mongoose-autopopulate');

const WorldNPC = new mongoose.Schema({
    npcData: { type: mongoose.Schema.Types.ObjectId, ref: "NPC", autopopulate: true },
    position: String, // x,y
    hitpoints: Number,
    dead: Boolean,

    drops: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }],

    stats: [{ type: mongoose.Schema.Types.ObjectId, ref: "StatProgress", autopopulate: true }],
    
    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem" }],
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem" }]
});


WorldNPC.plugin(timestamps);
WorldNPC.plugin(autopopulate);

const WorldNPCModel = mongoose.model("WorldNPC", WorldNPC);

module.exports = WorldNPCModel;