const eachSeries = require('async').eachSeries;

module.exports = function simulateBattle(initiator, target) {
    return new Promise((resolve, reject) => {
        var turn = 0;

        const interval = setInterval(() => {
            battleTick(turn === 0 ? initiator : target, turn === 0 ? target : initiator)
                .then((output) => {
                    turn = turn === 0 ? 1 : 0;

                    if (initiator.livelyUser) {
                        initiator.livelyUser.sendEvent({
                            type: "LOG_OUTPUT",
                            payload: output
                        })
                    }

                    if (initiator.data.hitpoints === 0 || target.data.hitpoints === 0) {
                        clearInterval(interval);

                        if (target.data.hitpoints === 0) {
                            rewardPlayerExp(initiator, target);
                            
                            giveDropsToPlayerAndSave(initiator, target.data.drops)
                                .then(() => {
                                    resolve(target);

                                    initiator.livelyUser.sendEvent({
                                        type: "BATTLE_FINISHED"
                                    });
                                })
                        } else {
                            initiator.livelyUser.sendEvent({
                                type: "BATTLE_FINISHED"
                            });
                        }

                        /*if (initiator.data.hitpoints === 0) {
                            if (target.livelyUser) {
                                giveDropsToPlayer(target, initiator.drops)
                                    .then(() => {
                                        target.livelyUser.sendEvent({
                                            type: "BATTLE_FINISHED"
                                        });
                                    })
                            }
                        }*/
                    }
                })
        }, 500);
    });
};

function battleTick(attacker, defender) {
    return new Promise((resolve, reject) => {
        const attackerName = attacker.data.username ? attacker.data.username : attacker.data.npcData.name;
        const defenderName = defender.data.username ? defender.data.username : defender.data.npcData.name;
    
        const attackerHP = attacker.data.hitpoints;
        const defenderHP = defender.data.hitpoints;
    
        const attackerStr = attacker.getStat("Strength").level;
        const attackerAtt = attacker.getStat("Attack").level;
    
        const defenderDef = defender.getStat("Defense").level;

        const attackerMainhandWeapon = attacker.data.equipment.find(item => item.item.equipTo === "mainhand");
    
        const attackHelp = (Math.random() * attackerAtt + 1) / 99; // 1 ... attackerAtt === 1 ... 99
        const willAttack = parseInt((Math.random() + attackHelp) * 2 + 1) >= 2;
    
        if (!willAttack) return resolve(`${attackerName} missed!`);
    
        // Thanks, Mushini! :D
        const strHelp = parseInt(((Math.random() * attackerStr) + 1) / 99 + 1);
        const minDamage = (attackerMainhandWeapon ? attackerMainhandWeapon.item.minDamage : 1) * strHelp;
        const maxDamage = (attackerMainhandWeapon ? attackerMainhandWeapon.item.maxDamage : 2) * strHelp;
    
        var actualDamage = parseInt(Math.random() * maxDamage + minDamage); 
        if (actualDamage > maxDamage) actualDamage = maxDamage;
    
        defender.hurt(actualDamage);

        defender.save()
            .then(() => {
                var tickText = `${attackerName} struck ${defenderName} for ${actualDamage} with their ${attackerMainhandWeapon ? attackerMainhandWeapon.item.name : "fist"}! ${defenderName} has ${defender.data.hitpoints} HP left.`;

                if (defender.data.hitpoints === 0) {
                    tickText += ` ${defenderName} has perished! :(`;
                }

                resolve(tickText);
            })
    })
};

function rewardPlayerExp(player, dead) {
    const focusStat = player.getStat(player.data.focus);

    if (focusStat) {
        player.rewardExp(player.data.focus, dead.getStat("Hitpoints").level * 4);
    } else {
        player.rewardExp("Attack", dead.getStat("Hitpoints").level * (4 / 3));
        player.rewardExp("Strength", dead.getStat("Hitpoints").level * (4 / 3));
        player.rewardExp("Defense", dead.getStat("Hitpoints").level * (4 / 3));
    }

    player.rewardExp("Hitpoints", dead.getStat("Hitpoints").level * 1.5);
};

function giveDropsToPlayerAndSave(player, drops) {
    return new Promise((resolve, reject) => {
        eachSeries(drops, (item, next) => {
            item.ownedByPlayer = player.data._id;

            item.save()
                .then(() => {
                    player.addItemToInventory(item);
                    player.livelyUser.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: `Received ${item.item.name} as a drop!`
                    });

                    next();
                })
        }, () => {
            player.save()
                .then(() => {
                    player.sendUpdate();

                    resolve();
                })
        })
    })
}