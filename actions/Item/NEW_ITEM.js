module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/items',

    fn(req, res, lively, Item) {
        return new Promise((resolve, reject) => {
            const item = req.body.item;

            const newItem = new Item(item);

            newItem.save()
                .then(() => {
                    res.json(newItem);

                    resolve();
                })
        })
    }
}