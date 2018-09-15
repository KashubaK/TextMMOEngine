const eachSeries = require('async').eachSeries;

module.exports = {
    name: "tile",
    description: "Add tiles to the world.",
    params: [
        "Tile Coordinate Set: `5,9-10,18`",
        "Tile Material: `Grass`",
        "Tile Traversability: `true`",
        "Tile Energy Cost: `1`",
        "Tile Type: `ground`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Tile = game.lively.getModel("Tile");
    
            const params = composed.split(" ");
            params.shift(); // Gets out the "tile"
    
            const coordinates = params[0]; // x,y-x2,y2
            const material = params[1];
            const traversable = params[2];
            const energyCost = params[3];
            const type = params[4];

            const tiles = [];

            const x1 = parseInt(coordinates.split("-")[0].split(",")[0]);
            const y1 = parseInt(coordinates.split("-")[0].split(",")[1]);

            const x2 = parseInt(coordinates.split("-")[1].split(",")[0]);
            const y2 = parseInt(coordinates.split("-")[1].split(",")[1]);

            for (var x = x1; x <= x2; x++) {
                for (var y = y1; y <= y2; y++) {
                    const position = `${x},${y}`;

                    tiles.push(new Tile({
                        position,
                        material,
                        type,
                        traversable,
                        energyCost
                    }))
                };
            }
            
            eachSeries(tiles, (tile, next) => {
                tile.save()
                    .then(() => {

                        game.setTile(tile.id, tile);

                        next();
                    })
            }, () => {
                player.livelyUser.sendEvent({
                    type: "TILES_CREATED",
                    payload: tiles
                });

                resolve(`New ${material} tiles created at [${x1},${y1} - ${x2},${y2}]`);
            })
        })
    }
}