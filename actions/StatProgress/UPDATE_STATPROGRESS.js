module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/statprogresses',

    fn(req, res, lively, StatProgress) {
        return new Promise((resolve, reject) => {
            const statProgress = req.body.statProgress;

            StatProgress.findByIdAndUpdate(statProgress._id, statProgress, { new: true })
                .then(newStatProgress => {
                    res.json(newStatProgress);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}