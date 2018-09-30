module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/statprogresses',

    fn(req, res, lively, StatProgress) {
        return new Promise((resolve, reject) => {
            const statProgress = req.body.statProgress;

            const newStatProgress = new StatProgress(statProgress);

            newStatProgress.save()
                .then(() => {
                    res.json(newStatProgress);

                    resolve();
                })
        })
    }
}