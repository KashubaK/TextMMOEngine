module.exports = {
    name: "stat",
    description: "Create a new stat.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Stat = game.lively.getModel("Stat");

            const params = composed.split(" ");
            params.shift();

            const name = params[0];
            const startingLevel = params[1];
            const startingExp = params[2];
            const maxLevel = params[3];

            const newStat = new Stat({
                name,
                startingLevel,
                startingExp,
                maxLevel
            });

            newStat.save()
                .then(() => {
                    resolve(`Stat ${name} created successfully.`);
                })
        })
    }
}