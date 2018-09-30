module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/stats/:stat_id',

    fn(req, res, lively, Stat) {
        return new Promise((resolve, reject) => {
            const stat_id = req.params.stat_id;

            Stat.findById(stat_id)
                .then(stat => {
                    res.json(stat)

                    resolve();
                })
        })
    }
}