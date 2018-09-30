module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/stats',

    fn(req, res, lively, Stat) {
        return new Promise((resolve, reject) => {
            const stat = req.body.stat;

            Stat.findByIdAndUpdate(stat._id, stat, { new: true })
                .then(newStat => {
                    res.json(newStat);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}