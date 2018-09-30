module.exports = {
    schema: {},

    method: 'del',
    endpoint: '/stats/:stat_id',

    fn(req, res, lively, Stat) {
        return new Promise((resolve, reject) => {
            const stat_id = req.params.stat_id;

            Stat.findByIdAndRemove(stat_id)
                .then(stat => {
                    res.json(stat)

                    resolve();
                })
        })
    }
}