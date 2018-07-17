const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamps');
const autopopulate = require('mongoose-autopopulate');

const WorldItem = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", autopopulate: true },
    position: String, // x,y

    state: mongoose.Schema.Types.Mixed,

    ownedByWorldNPC: { type: mongoose.Schema.Types.ObjectId, ref: "WorldNPC" },
    ownedByPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },

    droppedByPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    droppedByWorldNPC: { type: mongoose.Schema.Types.ObjectId, ref: "WorldNPC" }
});

WorldItem.plugin(timestamps);
WorldItem.plugin(autopopulate);

const WorldItemModel = mongoose.model("WorldItem", WorldItem);

module.exports = WorldItemModel;