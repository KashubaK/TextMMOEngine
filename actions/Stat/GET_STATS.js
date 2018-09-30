module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/stats',

    fn(req, res, lively, Stat) {
        return new Promise((resolve, reject) => {
            Stat.find({})
                .then(stats => {
                    res.json(stats)

                    resolve();
                })
        })
    }
}