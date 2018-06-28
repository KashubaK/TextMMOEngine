module.exports = {
    name: "npc",
    description: "Spawn an NPC at the desired position.",

    effect(player, game, composed) {
        const NPC = game.lively.getModel("NPC");

        return new Promise((resolve, reject) => {
            const params = composed.split(" ");
            params.shift(); // Gets out the "tile"
    
            const position = params[0]; // [x, y]
            const name = params[1];
            const attackable = params[2];
            const canTalkTo = params[3];
    
            const newNpc = new NPC({
                position,
                name,
                attackable,
                canTalkTo,
                hitpoints: 10,

                stats: [
                    {
                        name: "Hitpoints",
                        level: 10
                    },
                    {
                        name: "Attack",
                        level: 1
                    },
                    {
                        name: "Strength",
                        level: 1
                    },
                    {
                        name: "Defence",
                        level: 1
                    }
                ]
            });

            newNpc.save()
                .then(() => {
                    const matchedTile = game.tiles.find(tile => tile.position === newNpc.position);

                    matchedTile.npc = newNpc._id;

                    matchedTile.save()
                        .then(() => {
                            game.npcs = game.npcs.set(newNpc._id, newNpc);

                            player.livelyUser.sendEvent({
                                type: "TILE_UPDATED",
                                payload: matchedTile
                            });
        
                            resolve(`NPC ${name} created at [${newNpc.position}]`)
                        })
                })
        })
    }
}