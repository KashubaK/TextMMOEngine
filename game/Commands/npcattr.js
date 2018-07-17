module.exports = {
    name: "npcattr",
    description: "Add/change an NPC's attribute.",
    params: [
        "NPC Name: `Bob`",
        "NPC Attribute: `hitpoints`",
        "Attribute Value: `20`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const NPC = game.lively.getModel("NPC");

            const params = composed.split(" ");
            params.shift();

            const npcName = params[0];
            const attribute = params[1];
            const value = params[2];

            NPC.find({ name: npcName })
                .exec((err, npcs) => {
                    if (err) throw err;

                    if (npcs.length === 1) {
                        const npc = npcs[0];

                        NPC.findByIdAndUpdate(npc._id, { [attribute]: value }, { new: true })
                            .exec((err, newNpc) => {
                                if (err) throw err;
                                
                                resolve(`Set ${newNpc.name}.${attribute} to ${newNpc[attribute]} successfully.`);
                            })
                    } else {
                        return resolve(`NPC ${npcName} doesn't exist.`);
                    }
                })
        })
    }
}