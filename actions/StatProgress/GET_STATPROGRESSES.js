module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/statprogresses',

    fn(req, res, lively, StatProgress) {
        return new Promise((resolve, reject) => {
            StatProgress.find({})
                .then(statProgresses => {
                    res.json(statProgresses)

                    resolve();
                })
        })
    }
}