module.exports = {
    name: "spawnitem",
    description: "Spawn an item at the desired location.",
    params: [
        "Item Name: `Sword`",
        "Tile Coordinates: `5,3`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Item = game.lively.getModel("Item");
            const WorldItem = game.lively.getModel("WorldItem");

            const params = composed.split(" ");
            params.shift();

            const itemName = params[0];
            const position = params[1];

            const targetTile = game.tiles.find(tile => tile.position === position);

            if (!targetTile) return resolve(`Tile not found at position ${position}.`);

            Item.findOne({ name: itemName })
                .exec((err, item) => {
                    if (err) throw err;

                    if (item) {
                        const newWorldItem = new WorldItem({
                            item: item,
                            position,
                            droppedByPlayer: player.data._id
                        });

                        newWorldItem.save()
                            .then(() => {
                                targetTile.items.push(newWorldItem.id);
        
                                targetTile.save()
                                    .then(() => { 
                                        targetTile.items.pop();
                                        targetTile.items.push(newWorldItem);
                                        game.setTile(targetTile);
    
                                        player.livelyUser.sendEvent({
                                            type: "TILE_UPDATED",
                                            payload: targetTile
                                        });
    
                                        resolve(`Item ${newWorldItem.item.name} spawned at ${targetTile.position}`)
                                    });
                            })
                    } else {
                        resolve(`Item ${itemName} doesn't exist.`);
                    }
                })
        })
    }
}