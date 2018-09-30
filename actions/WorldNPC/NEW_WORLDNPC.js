module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/worldnpcs',

    fn(req, res, lively, WorldNPC) {
        return new Promise((resolve, reject) => {
            const worldNPC = req.body.worldNPC;

            const newWorldNPC = new WorldNPC(worldNPC);

            newWorldNPC.save()
                .then(() => {
                    res.json(newWorldNPC);

                    resolve();
                })
        })
    }
}