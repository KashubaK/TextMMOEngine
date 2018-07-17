const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamps');
const autopopulate = require('mongoose-autopopulate');

const PlayerSchema = new mongoose.Schema({
    username: String,
    password: String,
    
    level: Number,

    position: String, // x,y

    energy: Number,
    hitpoints: Number,

    focus: String,

    stats: [{ type: mongoose.Schema.Types.ObjectId, ref: "StatProgress", autopopulate: true }],

    equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }],
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem", autopopulate: true }],
    bank: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorldItem" }]
});

PlayerSchema.plugin(timestamps);
PlayerSchema.plugin(autopopulate);

const PlayerModel = mongoose.model('Player', PlayerSchema);


module.exports = PlayerModel;

