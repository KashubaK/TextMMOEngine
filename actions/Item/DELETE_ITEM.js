module.exports = {
    schema: {},

    method: 'del',
    endpoint: '/items/:item_id',

    fn(req, res, lively, Item) {
        return new Promise((resolve, reject) => {
            const item_id = req.params.item_id;

            Item.findByIdAndRemove(item_id)
                .then(item => {
                    res.json(item)

                    resolve();
                })
        })
    }
}