module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/worldtiles',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            const worldTile = req.body.worldTile;

            WorldTile
                .findByIdAndUpdate(worldTile._id, worldTile, { new: true })
                .populate('tileData')
                .then(newWorldTile => {
                    res.json(newWorldTile);

                    resolve();
                })
                .catch(err => {
                    res.json(err);

                    reject(err);
                })
        })
    }
}