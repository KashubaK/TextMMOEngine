module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/items',

    fn(req, res, lively, Item) {
        return new Promise((resolve, reject) => {
            Item.find({})
                .then(items => {
                    res.json(items)

                    resolve();
                })
        })
    }
}