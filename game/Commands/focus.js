module.exports = {
    name: "focus",
    description: "Switch your combat EXP focus.",
    params: [
        "Stat Name: `Attack`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            player.data.focus = composed.split(" ")[1];

            player.save()
                .then(() => {
                    player.sendUpdate();
                    resolve(`Focus shifted to ${player.data.focus}.`);
                })
        })
    }
}