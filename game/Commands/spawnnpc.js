const eachSeries = require('async').eachSeries;

module.exports = {
    name: "spawnnpc",
    description: "Spawn an NPC at the desired tile.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const NPC = game.lively.getModel("NPC");
            const StatProgress = game.lively.getModel("StatProgress");
            const WorldNPC = game.lively.getModel("WorldNPC");

            const params = composed.split(" ");
            params.shift();

            const npcName = params[0];
            const tilePosition = params[1]; // 1,1

            const targetTile = game.tiles.find(tile => tile.position === tilePosition);

            if (!targetTile) return resolve(`Tile not found at position ${tilePosition}.`);

            if (!targetTile.npc) {
                NPC.findOne({ name: npcName })
                    .exec((err, npc) => {
                        if (npc) {
                            const hitpointStat = npc.stats.find(stat => stat.name === "Hitpoints");

                            const worldNPC = new WorldNPC({
                                npcData: npc._id,
                                position: targetTile.position,
                                hitpoints: hitpointStat ? hitpointStat.stat.level : 10,
                                dead: false,

                                equipment: npc.equipment,
                                inventory: npc.inventory
                            })

                            worldNPC.save()
                                .then(() => {
                                    const statProgresses = [];

                                    eachSeries(npc.stats, (stat, next) => {
                                        const newStatProgress = new StatProgress({
                                            stat: stat.stat,
                                            belongsToWorldNPC: worldNPC._id,
                                            level: stat.level,
                                            exp: stat.exp
                                        });

                                        newStatProgress.save()
                                            .then(() => {
                                                statProgresses.push(newStatProgress);
                                                next();
                                            })
                                    }, () => {
                                        WorldNPC.findByIdAndUpdate(worldNPC._id, { stats: statProgresses }, { new: true })
                                            .populate('npcData stats')
                                            .exec((err, newWorldNPC) => {
                                                if (err) throw err;

                                                targetTile.npc = newWorldNPC.id;
        
                                                targetTile.save()
                                                    .then(() => {
                                                        targetTile.npc = newWorldNPC;
                                                        game.setTile(targetTile);
                    
                                                        player.livelyUser.sendEvent({
                                                            type: "TILE_UPDATED",
                                                            payload: targetTile
                                                        });
                    
                                                        resolve(`NPC ${newWorldNPC.npcData.name} spawned at ${targetTile.position}`)
                                                    });
                                            })
                                    })
                                })
                        } else {
                            resolve(`NPC ${npcName} doesn't exist.`);
                        }
                    })
            } else {
                resolve(`Tile ${tilePosition} already has an NPC (${targetTile.npc.name})`);
            }
        })
    }
}