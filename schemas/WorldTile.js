const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const WorldTile = new mongoose.Schema({
    tileData: { type: mongoose.Schema.Types.ObjectId, ref: "Tile", autopopulate: true },
    position: String, // x,y

    metadata: mongoose.Schema.Types.Mixed,

    npc: { type: mongoose.Schema.Types.ObjectId, ref: "WorldNPC", autopopulate: true },
    object: mongoose.Schema.Types.Mixed,
 
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }],
    itemsBelowGround: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }]
});

WorldTile.plugin(autopopulate);

const WorldTileModel = mongoose.model('WorldTile', WorldTile);

module.exports = WorldTileModel;