module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/tiles',

    fn(req, res, lively, Tile) {
        return new Promise((resolve, reject) => {
            Tile.find({})
                .then(tiles => {
                    res.json(tiles)

                    resolve();
                })
        })
    }
}