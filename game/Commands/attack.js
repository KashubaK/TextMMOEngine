const simulateBattle = require('../simulateBattle');

module.exports = {
    name: "attack",
    description: "Smack that fool up.",
    params: [
        "Target Tile: `0,3`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const WorldNPC = game.lively.getModel("WorldNPC");
            const target = composed.split(" ")[1];

            // 1,1

            const targetTile = game.tiles.find(tile => tile.position === target);
            var targetTileBeing;

            if (!targetTile.npc) {
                return resolve("There's nobody there. You swing anyway at some air and nothing happens. Awesome.");
            } else {
                targetTileBeing = game.worldNpcs.find(npc => npc.data.id === targetTile.npc.id);
            }

            player.livelyUser.sendEvent({
                type: "LOG_OUTPUT",
                payload: `The battle has started! Best of luck, ${targetTileBeing.data.npcData.name}!`
            })

            simulateBattle(player, targetTileBeing).then((dead) => {
                targetTile.npc = null;
                targetTile.save()
                    .then(() => {
                        game.setTile(targetTile);
                        game.worldNpcs = game.worldNpcs.filter(npc => npc.data._id !== dead.data._id);

                        player.livelyUser.sendEvent({
                            type: "TILE_UPDATED",
                            payload: targetTile
                        });

                        WorldNPC.deleteOne({ _id: dead.data._id })
                            .exec((err) => {
                                if (err) throw err;

                                resolve(`${dead.data.npcData.name} has died.`);
                            })
                    })
            });
        })
    }
}