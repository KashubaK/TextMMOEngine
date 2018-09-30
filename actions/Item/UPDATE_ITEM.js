module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/items',

    fn(req, res, lively, Item) {
        return new Promise((resolve, reject) => {
            const item = req.body.item;

            Item.findByIdAndUpdate(item._id, item, { new: true })
                .then(newItem => {
                    res.json(newItem);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}