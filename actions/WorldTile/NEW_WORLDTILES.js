module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/worldtiles',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            const { worldTiles } = req.body;

            WorldTile.insertMany(worldTiles)
                .then((newWorldTiles) => {
                    WorldTile.populate(newWorldTiles, { path: 'tileData' })
                        .then(populatedWorldTiles => {
                            res.json(populatedWorldTiles);
                            resolve();
                        })
                })
        })
    }
}