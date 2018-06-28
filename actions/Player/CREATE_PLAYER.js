module.exports = {
    schema: {
        properties: {
            username: { type: "string" },
            password: { type: "string" }
        }
    },

    fn(payload, sender, lively, Player) {
        return new Promise((resolve, reject) => {
            const hitpointStat = {
                name: "Hitpoints",
                description: "Don't let this go down to 0. 'Cause you'll die or something.",
                exp: 0,
                level: 10
            };

            const newPlayer = new Player({
                username: payload.username,
                password: payload.password,
                position: "0,0"
            });

            newPlayer.hitpoints = 10;
            newPlayer.stats = [
                {
                    name: "Hitpoints",
                    exp: 0,
                    level: 10
                },
                {
                    name: "Attack",
                    exp: 0,
                    level: 1
                },
                {
                    name: "Strength",
                    exp: 0,
                    level: 1
                },
                {
                    name: "Defence",
                    exp: 0,
                    level: 1
                }
            ];

            newPlayer.save()
                .then(() => {
                    sender.sendEvent({
                        type: "PLAYER_CREATED"
                    });

                    resolve();
                });
        });
    }
}