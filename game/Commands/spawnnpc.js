const eachSeries = require('async').eachSeries;
const Being = require('../Being');

module.exports = {
    name: "spawnnpc",
    description: "Spawn an NPC at the desired tile.",
    params: [
        "NPC Name: `Bob`",
        "Tile Coordinates: `3,5`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const NPC = game.lively.getModel("NPC");
            const StatProgress = game.lively.getModel("StatProgress");
            const WorldNPC = game.lively.getModel("WorldNPC");
            const WorldItem = game.lively.getModel("WorldItem");

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
                                npcData: npc,
                                position: targetTile.position,
                                hitpoints: hitpointStat ? hitpointStat.stat.level : 10,
                                dead: false,

                                equipment: npc.equipment,
                                inventory: npc.inventory
                            })

                            worldNPC.save().then(() => {
                                createStatProgresses(worldNPC, npc).then(statProgresses => {
                                    createWorldItemDrops(worldNPC).then(drops => {
                                        WorldNPC.findByIdAndUpdate(worldNPC._id, { stats: statProgresses, drops: drops }, { new: true })
                                            .populate('npcData stats drops')
                                            .exec((err, newWorldNPC) => {
                                                if (err) throw err;

                                                targetTile.npc = newWorldNPC.id;
        
                                                targetTile.save().then(() => {
                                                    targetTile.npc = newWorldNPC;
                                                    game.setTile(targetTile);

                                                    game.worldNpcs = game.worldNpcs.set(newWorldNPC.id, new Being(newWorldNPC));
                
                                                    player.livelyUser.sendEvent({
                                                        type: "TILE_UPDATED",
                                                        payload: targetTile
                                                    });
                
                                                    resolve(`NPC ${newWorldNPC.npcData.name} spawned at ${targetTile.position}`)
                                                });
                                            })
                                    })
                                })
                            })
                        } else {
                            resolve(`NPC ${npcName} doesn't exist.`);
                        }
                    })
            } else {
                resolve(`Tile ${tilePosition} already has an NPC (${targetTile.npc.name})`);
            };

            function createStatProgresses(worldNPC, npc) {
                return new Promise((resolve, reject) => {
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
                        resolve(statProgresses);
                    })
                })
            }

            function createWorldItemDrops(worldNpc) {
                return new Promise((resolve, reject) => {
                    const dropTable = worldNpc.npcData.dropTable;
                    const drops = [];
    
                    eachSeries(dropTable, (drop, next) => {
                        const { item, chance } = drop;
                        const chanceResult = chance / 100000 * 100 + 1; // 1 ... 100
    
                        if (Math.random() * 100 + 1 <= chanceResult) {
                            const newWorldItem = new WorldItem({
                                item: item,
                                state: {},
                                ownedByWorldNPC: worldNpc._id
                            });
    
                            newWorldItem.save()
                                .then(() => {
                                    newWorldItem.item = item;
                                    drops.push(newWorldItem);
                                    next();
                                })
                        } else {
                            next();
                        }
                    }, () => {
                        resolve(drops);
                    });
                })
            }
        })
    }
}