module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/worlditems',

    fn(req, res, lively, WorldItem) {
        return new Promise((resolve, reject) => {
            const worldItem = req.body.worldItem;

            WorldItem.findByIdAndUpdate(worldItem._id, worldItem, { new: true })
                .then(newWorldItem => {
                    res.json(newWorldItem);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}