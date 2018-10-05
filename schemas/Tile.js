const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const Tile = new mongoose.Schema({
    name: String,
    material: String,
    type: String, // Floor, Door, etc.

    energyCost: Number,
    traversable: String
});

Tile.plugin(autopopulate);

const TileModel = mongoose.model('Tile', Tile);

module.exports = TileModel;