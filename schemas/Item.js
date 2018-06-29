const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    
    consumable: Boolean,
    equipable: Boolean,
    equipTo: String,

    type: String, // "Weapon", "Material", 
    rarity: Number, // 0 - common, 1 - uncommon, ...
    
    weight: Number,
    size: Number, // 2

    minDamage: Number,
    maxDamage: Number,

    stats: [mongoose.Schema.Types.Mixed],
    effects: [mongoose.Schema.Types.Mixed]
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;