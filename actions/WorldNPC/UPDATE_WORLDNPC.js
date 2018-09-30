module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/worldnpcs',

    fn(req, res, lively, WorldNPC) {
        return new Promise((resolve, reject) => {
            const worldNPC = req.body.worldNPC;

            WorldNPC.findByIdAndUpdate(worldNPC._id, worldNPC, { new: true })
                .then(newWorldNPC => {
                    res.json(newWorldNPC);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}