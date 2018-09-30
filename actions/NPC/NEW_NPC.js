module.exports = {
    schema: {},

    method: 'post',
    endpoint: '/npcs',

    fn(req, res, lively, NPC) {
        return new Promise((resolve, reject) => {
            const npc = req.body.npc;

            const newNPC = new NPC(npc);

            newNPC.save()
                .then(() => {
                    res.json(newNPC);

                    resolve();
                })
        })
    }
}