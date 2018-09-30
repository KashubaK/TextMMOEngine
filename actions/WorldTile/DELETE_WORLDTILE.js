module.exports = {
    schema: {},

    method: 'del',
    endpoint: '/worldTiles/:worldTile_id',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            const worldTile_id = req.params.worldTile_id;

            WorldTile.findByIdAndRemove(worldTile_id)
                .then(worldTile => {
                    res.json(worldTile)

                    resolve();
                })
        })
    }
}