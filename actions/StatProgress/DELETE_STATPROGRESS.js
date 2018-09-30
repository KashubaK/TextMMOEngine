module.exports = {
    schema: {},

    method: 'del',
    endpoint: '/statprogresses/:statprogress_id',

    fn(req, res, lively, StatProgress) {
        return new Promise((resolve, reject) => {
            const statProgress_id = req.params.statProgress_id;

            StatProgress.findByIdAndRemove(statProgress_id)
                .then(statProgress => {
                    res.json(statProgress)

                    resolve();
                })
        })
    }
}