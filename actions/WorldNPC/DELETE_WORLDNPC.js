module.exports = {
    schema: {},

    method: 'del',
    endpoint: '/worldnpcs/:worldnpc_id',

    fn(req, res, lively, WorldNPC) {
        return new Promise((resolve, reject) => {
            const worldNPC_id = req.params.worldNPC_id;

            WorldNPC.findByIdAndRemove(worldNPC_id)
                .then(worldNPC => {
                    res.json(worldNPC)

                    resolve();
                })
        })
    }
}