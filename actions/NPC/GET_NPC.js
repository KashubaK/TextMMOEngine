module.exports = {
    schema: {},

    method: 'get',
    endpoint: '/npcs/:npc_id',

    fn(req, res, lively, NPC) {
        return new Promise((resolve, reject) => {
            const npc_id = req.params.npc_id;

            NPC.findById(npc_id)
                .then(npc => {
                    res.json(npc)

                    resolve();
                })
        })
    }
}