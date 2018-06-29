module.exports = {
    name: "item",
    description: "Creates an item.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Item = game.lively.getModel("Item");

            const params = composed.split(" ");
            params.shift();

            const name = params[0];

            Item.find({ name })
                .exec((err, items) => {
                    if (err) throw err;

                    if (items.length === 0) {
                        const newItem = new Item({ name });
                        
                        newItem.save()
                            .then(() => {
                                resolve(`Item ${name} created succesfully.`);
                            })
                    } else {
                        return resolve(`Item ${name} already exists.`);
                    }
                })
        })
    }
}