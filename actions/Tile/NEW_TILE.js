module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/tiles',

    fn(req, res, lively, Tile) {
        return new Promise((resolve, reject) => {
            const tile = req.body.tile;

            const newTile = new Tile(tile);

            newTile.save()
                .then(() => {
                    res.json(newTile);

                    resolve();
                })
        })
    }
}