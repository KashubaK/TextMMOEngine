const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

const StatProgress = new mongoose.Schema({
    stat: { type: mongoose.Schema.Types.ObjectId, ref: "Stat", autopopulate: true },
    exp: Number, // stat.startingExp
    level: Number, // stat.startingLevel

    belongsToNPC: { type: mongoose.Schema.Types.ObjectId, ref: "NPC" },
    belongsToWorldNPC: { type: mongoose.Schema.Types.ObjectId, ref: "WorldNPC" },
    belongsToPlayer: { type: mongoose.Schema.Types.ObjectId, ref: "Player" }
});

StatProgress.plugin(autopopulate);

const StatProgressModel = mongoose.model('StatProgress', StatProgress);

module.exports = StatProgressModel;