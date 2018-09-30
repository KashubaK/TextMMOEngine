module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/tiles/:tile_id',

    fn(req, res, lively, Tile) {
        return new Promise((resolve, reject) => {
            const tile_id = req.params.tile_id;

            Tile.findById(tile_id)
                .then(tile => {
                    res.json(tile)

                    resolve();
                })
        })
    }
}