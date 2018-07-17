module.exports = {
    name: "heal",
    description: "Heal yourself for a desired amount.",
    params: [
        "Healing Amount: `10`"
    ],

    effect(player, target, composed) {
        return new Promise((resolve, reject) => {
            const healFor = parseInt(composed.split(" ")[1]) || 5;
    
            const playerData = player.livelyUser.data;
    
            const hitpoints = player.getStat('Hitpoints');
            const healedFor = playerData.hitpoints + healFor > hitpoints.level ? hitpoints.level - playerData.hitpoints : healFor;
    
            player.heal(healFor);

            player.save()
                .then(() => {
                    player.sendUpdate();
                    resolve(`${playerData.username} was healed for ${healedFor} hp (${playerData.hitpoints}/${hitpoints.level}).`);
                })
        })
    }
}