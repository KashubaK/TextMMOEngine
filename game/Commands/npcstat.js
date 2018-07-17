module.exports = {
    name: "npcstat",
    description: "Add a Stat to an NPC.",
    params: [
        "NPC Name: `Bob`",
        "Stat Name: `Attack`",
        "Stat Level: `20`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const NPC = game.lively.getModel("NPC");
            const Stat = game.lively.getModel("Stat");
            const StatProgress = game.lively.getModel("StatProgress");

            const params = composed.split(" ");
            params.shift();

            const npcName = params[0];
            const stat = params[1];
            const level = params[2];

            NPC.find({ name: npcName })
                .exec((err, npcs) => {
                    if (err) throw err;

                    if (npcs.length === 1) {
                        const npc = npcs[0];

                        Stat.find({ name: stat })
                            .exec((err, stats) => {
                                if (stats.length === 1) {
                                    const statId = stats[0].id;

                                    StatProgress.findOne({ stat: statId, belongsToNPC: npc._id })
                                        .exec((err, aStatProgress) => {
                                            if (err) throw err;

                                            if (!aStatProgress) {
                                                const statProgress = new StatProgress({
                                                    stat: statId,
                                                    exp: 0,
                                                    level,
                                                    belongsToNPC: npc._id
                                                });
            
                                                statProgress.save()
                                                    .then(() => {
                                                        NPC.findByIdAndUpdate(npc._id, { $addToSet: { stats: statProgress._id } }, { new: true })
                                                            .exec((err, newNpc) => {
                                                                if (err) throw err;
                                                                
                                                                resolve(`Set ${newNpc.name}.stats.${stats[0].name} to level ${level}/${stats[0].maxLevel} successfully.`);
                                                            })
                                                    })
                                            } else {
                                                resolve(`Stat ${stat} already exists on ${npc.name}.`);
                                            }
                                        })
                                } else {
                                    resolve(`Stat ${stat} doesn't exist.`);
                                }
                            })
                    } else {
                        resolve(`NPC ${npcName} doesn't exist.`);
                    }
                })
        })
    }
}