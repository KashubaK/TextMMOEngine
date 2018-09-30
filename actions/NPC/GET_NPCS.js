module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/npcs',

    fn(req, res, lively, NPC) {
        return new Promise((resolve, reject) => {
            NPC.find({})
                .then(npcs => {
                    res.json(npcs)

                    resolve();
                })
        })
    }
}