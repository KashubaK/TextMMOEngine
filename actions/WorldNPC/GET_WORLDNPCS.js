module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/worldnpcs',

    fn(req, res, lively, WorldNPC) {
        return new Promise((resolve, reject) => {
            WorldNPC.find({})
                .then(worldNPCs => {
                    res.json(worldNPCs)

                    resolve();
                })
        })
    }
}