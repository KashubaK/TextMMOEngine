module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/tiles',

    fn(req, res, lively, Tile) {
        return new Promise((resolve, reject) => {
            const tile = req.body.tile;

            Tile.findByIdAndUpdate(tile._id, tile, { new: true })
                .then(newTile => {
                    res.json(newTile);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}