module.exports = {
    name: "npcdrop",
    description: "Add an item to an NPC's drop table.",
    params: [
        "NPC Name: `Bob`",
        "Item Name: `Sword`",
        "Chance (x/100000): `20000`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const NPC = game.lively.getModel("NPC");
            const Item = game.lively.getModel("Item");

            const params = composed.split(" ");
            params.shift();

            const npcName = params[0];
            const itemName = params[1];
            const chance = params[2];

            NPC.findOne({ name: npcName })
                .exec((err, npc) => {
                    if (err) throw err;

                    if (npc) {
                        Item.findOne({ name: itemName })
                            .exec((err, item) => {
                                if (err) throw err;

                                if (item) {
                                    const dropTableEntry = {
                                        item,
                                        chance
                                    };

                                    NPC.findByIdAndUpdate(npc._id, { $addToSet: { dropTable: dropTableEntry } }, { new: true })
                                        .exec((err, newNpc) => {
                                            if (err) throw err;
                                            
                                            resolve(`Added ${item.name} with a chance of ${chance / 100000 * 100}% to drop from ${newNpc.name}.`)
                                        })
                                } else {
                                    resolve(`Item ${itemName} doesn't exist.`);
                                }
                            })
                    } else {
                        resolve(`NPC ${npcName} doesn't exist.`);
                    }
                })
        })
    }
}