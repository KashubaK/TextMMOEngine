module.exports = {
    schema: {
        type: "string"
    },

    fn: function(payload, sender, lively) {
        return new Promise((resolve, reject) => {
            const game = lively.service('Game');
            const player = game.getPlayer(sender.data._id);

            if (!player) return reject("Unknown user can't send commands.");
            
            game.interpretCommand(player, payload)
                .then((output) => {
                    sender.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: output
                    })
                    
                    resolve();
                })
        })
    }
}