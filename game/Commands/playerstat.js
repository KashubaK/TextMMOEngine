module.exports = {
    name: "playerstat",
    description: "Add a Stat to an Player.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Player = game.lively.getModel("Player");
            const Stat = game.lively.getModel("Stat");
            const StatProgress = game.lively.getModel("StatProgress");

            const params = composed.split(" ");
            params.shift();

            const playerName = params[0];
            const stat = params[1];
            const level = params[2];

            Player.findOne({ username: playerName })
                .exec((err, player) => {
                    if (err) throw err;

                    if (player) {
                        Stat.find({ name: stat })
                            .exec((err, stats) => {
                                if (stats.length === 1) {
                                    const statId = stats[0].id;

                                    StatProgress.findOne({ stat: statId, belongsToPlayer: player._id })
                                        .exec((err, aStatProgress) => {
                                            if (err) throw err;

                                            if (!aStatProgress) {
                                                const statProgress = new StatProgress({
                                                    stat: statId,
                                                    exp: 0,
                                                    level,
                                                    belongsToPlayer: player._id
                                                });
            
                                                statProgress.save()
                                                    .then(() => {
                                                        Player.findByIdAndUpdate(player._id, { $addToSet: { stats: statProgress._id } }, { new: true })
                                                            .exec((err, newPlayer) => {
                                                                if (err) throw err;
                                                                
                                                                resolve(`Set ${newPlayer.username}.stats.${stats[0].name} to level ${level}/${stats[0].maxLevel} successfully.`);
                                                            })
                                                    })
                                            } else {
                                                resolve(`Stat ${stat} already exists on ${player.name}.`);
                                            }
                                        })
                                } else {
                                    resolve(`Stat ${stat} doesn't exist.`);
                                }
                            })
                    } else {
                        resolve(`Player ${playerName} doesn't exist.`);
                    }
                })
        })
    }
}