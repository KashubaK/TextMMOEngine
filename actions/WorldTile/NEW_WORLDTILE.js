module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/worldtiles',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            const worldTile = req.body.worldTile;

            const newWorldTile = new WorldTile(worldTile);

            newWorldTile.save()
                .then(() => {
                    res.json(newWorldTile);

                    resolve();
                })
        })
    }
}