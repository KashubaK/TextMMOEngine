module.exports = {
    name: "use",
    description: "Use an item.",
    params: [
        "Item Name: `Bones`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const itemName = composed.split(" ")[1];
            const item = player.getItemFromInventory(itemName);

            if (item) {
                const use = game.commandInterpreter.getUse(itemName);

                if (use) {
                    use.effect(player, game, item)
                        .then(() => {
                            player.removeItemFromInventory(item);

                            player.save()
                                .then(() => {
                                    player.sendUpdate();

                                    resolve();
                                })
                        });
                } else {
                    resolve(`Nothing interesting happens.`);
                }
            } else {
                resolve(`${itemName} is not in your inventory.`);
            }
        })
    }
}