module.exports = {
    name: "equip",
    description: "Equip an item from your inventory.",
    params: [
        "Item Name: `stick`"
    ],

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const params = composed.split(" ");
            params.shift();
            
            const itemName = params[0];

            const inventory = player.data.inventory;
            const desiredItem = inventory.find(item => item.item.name === itemName);

            if (!desiredItem) return resolve(`You don't have ${itemName} in your inventory!`);

            const existingEquipment = player.getItemFromEquipment(desiredItem.item.equipTo);
            if (existingEquipment) player.removeItemFromEquipment(existingEquipment);

            player.data.equipment.push(desiredItem);
            inventory.splice(inventory.indexOf(desiredItem), 1);

            player.save()
                .then(() => {
                    player.sendUpdate();

                    resolve(`You equipped the ${itemName}.`);
                })
        })
    }
}