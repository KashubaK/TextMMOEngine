module.exports = {
    name: "hurt",
    description: "Hurt yourself for an amount of HP.",
    params: [
        "Damage Amount: `5`"
    ],

    effect(player, target, composed) {
        return new Promise((resolve, reject) => {
            const hurtFor = composed.split(" ")[1] || 5;

            const playerData = player.livelyUser.data;

            const hitpoints = player.getStat('Hitpoints');
            const leftOverDamage = playerData.hitpoints - hurtFor < 0 ? Math.abs(playerData.hitpoints - hurtFor) : 0;
            const actualDamage = hurtFor - leftOverDamage;

            player.hurt(hurtFor);
            player.save()
                .then(() => {
                    player.sendUpdate();
                    resolve(`${playerData.username} was hurt for ${actualDamage} hp (${playerData.hitpoints}/${hitpoints.level}).`);
                });
        });
    }
}