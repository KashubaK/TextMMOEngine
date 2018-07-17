module.exports = {
    name: "Bones",
    description: "Bury the bones for 5 Prayer EXP.",

    effect(player, game, item) {
        return new Promise((resolve, reject) => {
            player.rewardExp("Hitpoints", 5);

            player.livelyUser.sendEvent({
                type: "LOG_OUTPUT",
                payload: "You bury the bones."
            });

            resolve();
        })
    }
}