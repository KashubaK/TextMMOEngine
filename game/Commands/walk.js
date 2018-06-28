module.exports = {
    name: "walk",
    description: "Walk to a tile.",

    effect(player, game, composed) {
        return new Promise((resolve, reject) => {
            const params = composed.split(" ");
            params.shift();
    
            const position = params[0];
            player.changePosition(position);
            
            player.save()
                .then(() => {
                    player.sendUpdate();
                    resolve(`${player.livelyUser.data.username} walked to ${player.livelyUser.data.position}`);
                });
        })
    }
}