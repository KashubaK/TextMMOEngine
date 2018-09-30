module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/stats',

    fn(req, res, lively, Stat) {
        return new Promise((resolve, reject) => {
            const stat = req.body.stat;

            const newStat = new Stat(stat);

            newStat.save()
                .then(() => {
                    res.json(newStat);

                    resolve();
                })
        })
    }
}