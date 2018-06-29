module.exports = function simulateBattle(initiator, target) {
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

                if (target.livelyUser) {
                    target.livelyUser.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: output
                    })
                }

                if (initiator.data.hitpoints === 0 || target.data.hitpoints === 0) {
                    clearInterval(interval);

                    if (initiator.livelyUser) {
                        initiator.livelyUser.sendEvent({
                            type: "BATTLE_FINISHED"
                        });
                    }
    
                    if (target.livelyUser) {
                        target.livelyUser.sendEvent({
                            type: "BATTLE_FINISHED"
                        });
                    }
                }
            })
    }, 500);
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