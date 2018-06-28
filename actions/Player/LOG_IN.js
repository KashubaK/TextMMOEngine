module.exports = {
    schema: {
        required: ["username", "password"],

        properties: {
            username: { type: "string" },
            password: { type: "string" }
        }
    },

    fn(payload, sender, lively, Player) {
        const game = lively.service('Game');

        return new Promise((resolve, reject) => {
            Player.findOne({ username: payload.username })
                .exec((err, player) => {
                    if (err) return reject(err);

                    if (player.password === payload.password) {
                        game.addPlayer(player, sender);

                        sender.data = player;

                        const tiles = game.tiles.toArray();
                        const players = game.getPlayers();

                        sender.sendEvent({
                            type: "PLAYER_LOGGED_IN",
                            payload: {
                                player,
                                players,
                                tiles
                            }
                        });
                    } else {
                        sender.sendEvent({
                            type: "INCORRECT_LOGIN"
                        });
                    }
    
                    resolve();
                });
        });
    }
}