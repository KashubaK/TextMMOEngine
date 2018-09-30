module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/worlditems/:worlditem_id',

    fn(req, res, lively, WorldItem) {
        return new Promise((resolve, reject) => {
            const worldItem_id = req.params.worldItem_id;

            WorldItem.findById(worldItem_id)
                .then(worldItem => {
                    res.json(worldItem)

                    resolve();
                })
        })
    }
}