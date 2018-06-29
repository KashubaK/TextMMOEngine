module.exports = {
    name: "npc",
    description: "Creates an npc.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const NPC = game.lively.getModel("NPC");

            const params = composed.split(" ");
            params.shift();

            const name = params[0];

            NPC.find({ name })
                .exec((err, npcs) => {
                    if (err) throw err;

                    if (npcs.length === 0) {
                        const newNPC = new NPC({ name });
                        
                        newNPC.save()
                            .then(() => {
                                resolve(`NPC ${name} created succesfully.`);
                            })
                    } else {
                        return resolve(`NPC ${name} already exists.`);
                    }
                })
        })
    }
}