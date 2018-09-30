module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/worldtiles/:worldtile_id',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            const worldTile_id = req.params.worldTile_id;

            WorldTile.findById(worldTile_id)
                .then(worldTile => {
                    res.json(worldTile)

                    resolve();
                })
        })
    }
}