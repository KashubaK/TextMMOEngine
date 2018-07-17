module.exports = {
    name: "help",
    description: "Figure out how to use a command.",
    params: [
        "Command Name: `walk`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const commandName = composed.split(" ")[1];
            const command = game.commandInterpreter.getCommand(commandName);

            player.livelyUser.sendEvent({
                type: "LOG_OUTPUT",
                payload: ``
            });

            if (command) {
                player.livelyUser.sendEvent({
                    type: "LOG_OUTPUT",
                    payload: `${command.name}: ${command.description}`
                });

                player.livelyUser.sendEvent({
                    type: "LOG_OUTPUT",
                    payload: `Amount of parameters: ${command.params.length}`
                });

                command.params.forEach((param, i) => {
                    player.livelyUser.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: `${i + 1}. ${param}`
                    });
                });
            } else {
                game.commandInterpreter.commands.forEach(command => {
                    player.livelyUser.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: `${command.name}: ${command.description}`
                    });
                })
            }

            resolve("");
        })
    }
}