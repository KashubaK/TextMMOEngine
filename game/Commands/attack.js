const simulateBattle = require('../simulateBattle');

module.exports = {
    name: "attack",
    description: "Smack that bitch up.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const target = composed.split(" ")[1];

            // 1,1

            const targetTile = game.tiles.find(tile => tile.position === target);
            var targetTileBeing;

            if (!targetTile.npc) {
                return resolve("There's nobody there. You swing anyway at some air and nothing happens. Awesome.");
            } else {
                targetTileBeing = game.npcs.find(npc => npc.data.id === targetTile.npc.id);
            }

            simulateBattle(player, targetTileBeing);

            resolve(`The battle has started! Best of luck, ${targetTileBeing.data.name}!`);
        })
    }
}