module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/worlditems',

    fn(req, res, lively, WorldItem) {
        return new Promise((resolve, reject) => {
            const worldItem = req.body.worldItem;

            const newWorldItem = new WorldItem(worldItem);

            newWorldItem.save()
                .then(() => {
                    res.json(newWorldItem);

                    resolve();
                })
        })
    }
}