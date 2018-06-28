module.exports = {
    name: "tile",
    description: "Add a tile to the world.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Tile = game.lively.getModel("Tile");
    
            const params = composed.split(" ");
            params.shift(); // Gets out the "tile"
    
            const position = params[0]; // [x, y]
            const material = params[1];
            const traversable = params[2];
            const energyCost = params[3];
            const type = params[4];
    
            const tile = new Tile({
                position,
                material,
                type,
                traversable,
                energyCost
            });
    
            tile.save()
                .then(() => {
                    game.tiles = game.tiles.set(tile._id, tile);

                    player.livelyUser.sendEvent({
                        type: "TILE_CREATED",
                        payload: tile
                    })

                    resolve(`New ${material} tile created at [${tile.position}]`);
                })
        })
    }
}