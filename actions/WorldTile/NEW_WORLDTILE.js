module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/worldtiles',

    fn(req, res, lively, WorldTile) {
        return new Promise((resolve, reject) => {
            const worldTile = new WorldTile(req.body.worldTile);

            worldTile.save()
                .then(() => {
                    worldTile.populate('tileData', function(err, newWorldTile) {
                        if (err) return reject(err);
                        
                        res.json(newWorldTile);
    
                        resolve();
                    })
                })
        })
    }
}