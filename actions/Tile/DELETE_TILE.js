module.exports = {
    schema: {},

    method: 'del',
    endpoint: '/tiles/:tile_id',

    fn(req, res, lively, Tile) {
        return new Promise((resolve, reject) => {
            const tile_id = req.params.tile_id;

            Tile.findByIdAndRemove(tile_id)
                .then(tile => {
                    res.json(tile)

                    resolve();
                })
        })
    }
}