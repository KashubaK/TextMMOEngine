module.exports = {
    name: "look",
    description: "Check something out.",
    params: [
        "Target Tile: `0,3`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const target = composed.split(" ")[1];
            // 1,1 etc.

            const targetTile = game.tiles.find(tile => tile.position === target);

            if (!targetTile) return resolve("There's no tile there!");

            if (targetTile.npc) {
                return resolve(`You gaze at ${targetTile.npc.name}.\n${targetTile.npc.name}'s level is ${targetTile.npc.level}.`);
            }

            resolve(`It's just some ${targetTile.material}.`)
        })
    }
}