module.exports = {
    name: "pickup",
    description: "Pick up the first item on a tile.",
    params: [],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const position = player.data.position;
            const targetTile = game.tiles.find(tile => tile.position === position);
            const item = targetTile.items.pop();

            targetTile.save()
                .then(() => {
                    game.setTile(targetTile);

                    item.ownedByPlayer = player.data._id;
                    item.save()
                        .then(() => {
                            player.addItemToInventory(item);
                            player.save()
                                .then(() => {
                                    player.sendUpdate();
        
                                    resolve(`Picked up a ${item.item.name}!`);
                                })
                        })
                })
        })
    }
}