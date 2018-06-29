const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamps');
const autopopulate = require('mongoose-autopopulate');

const WorldItem = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", autopopulate: true },
    position: String, // x,y

    state: mongoose.Schema.Types.Mixed,

    ownedByNPC: { type: mongoose.Schema.Types.ObjectId, ref: "NPC" },
    ownedByPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },

    droppedByPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    droppedByNPC: { type: mongoose.Schema.Types.ObjectId, ref: "NPC" }
});

WorldItem.plugin(timestamps);
WorldItem.plugin(autopopulate);

const WorldItemModel = mongoose.model("WorldItem", WorldItem);

module.exports = WorldItemModel;