module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/worldtiles',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            WorldTile.find({})
                .then(worldTiles => {
                    res.json(worldTiles)

                    resolve();
                })
        })
    }
}