const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Tile = new mongoose.Schema({
    name: String,
    material: String,
    type: String, // Floor, Door, etc.
    position: String, // x,y

    energyCost: Number,
    traversable: Boolean,

    metadata: mongoose.Schema.Types.Mixed,

    npc: { type: mongoose.Schema.Types.ObjectId, ref: "WorldNPC", autopopulate: true },
    object: mongoose.Schema.Types.Mixed,
 
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }],
    itemsBelowGround: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }]
});

Tile.plugin(autopopulate);

const TileModel = mongoose.model('Tile', Tile);

module.exports = TileModel;