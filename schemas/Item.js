const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: String, // Attack
    description: String,
    
    equipable: Boolean,
    equipTo: String,

    type: String, // "Weapon", "Material", 
    rarity: Number, // "Weapon", "Material", 
    
    weight: Number,
    size: Number, // 2

    stats: [mongoose.Schema.Types.Mixed],
    effects: [mongoose.Schema.Types.Mixed]
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = ItemModel;