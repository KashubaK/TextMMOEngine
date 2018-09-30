module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/worlditems',

    fn(req, res, lively, WorldItem) {
        return new Promise((resolve, reject) => {
            WorldItem.find({})
                .then(worldItems => {
                    res.json(worldItems)

                    resolve();
                })
        })
    }
}