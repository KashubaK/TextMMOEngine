module.exports = {
    schema: {},

    method: 'put',
    endpoint: '/npcs',

    fn(req, res, lively, NPC) {
        return new Promise((resolve, reject) => {
            const npc = req.body.npc;

            NPC.findByIdAndUpdate(npc._id, npc, { new: true })
                .then(newNPC => {
                    res.json(newNPC);

                    resolve();
                })
                .catch(err => {
                    res.json(err);
                })
        })
    }
}