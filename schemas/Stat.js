const mongoose = require('mongoose');

const Stat = new mongoose.Schema({
    name: String, // Attack
    description: String, // Higher the level, higher the chance of an attack landing.

    startingExp: Number, // 0
    startingLevel: Number, // 1

    maxLevel: Number, // 99
});

const StatModel = mongoose.model("Stat", Stat);

module.exports = StatModel;