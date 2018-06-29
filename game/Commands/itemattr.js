module.exports = {
    name: "itemattr",
    description: "Add/change an item's attribute.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const Item = game.lively.getModel("Item");

            const params = composed.split(" ");
            params.shift();

            const itemName = params[0];
            const attribute = params[1];
            const value = params[2];

            Item.find({ name: itemName })
                .exec((err, items) => {
                    if (err) throw err;

                    if (items.length === 1) {
                        const item = items[0];

                        Item.findByIdAndUpdate(item._id, { [attribute]: value }, { new: true })
                            .exec((err, newItem) => {
                                if (err) throw err;

                                resolve(`Set ${newItem.name}.${attribute} to ${newItem[attribute]} successfully.`);
                            })
                    } else {
                        return resolve(`Item ${itemName} doesn't exist.`);
                    }
                })
        })
    }
}