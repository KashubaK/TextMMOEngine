module.exports = function simulateBattle(attacker, defender) {
    var turn = 0;

    const interval = setInterval(() => {
        battleTick(turn === 0 ? attacker : defender, turn === 0 ? defender : attacker)
            .then((output) => {
                turn = turn === 0 ? 1 : 0;

                if (attacker.livelyUser) {
                    attacker.livelyUser.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: output
                    })
                }

                if (defender.livelyUser) {
                    defender.livelyUser.sendEvent({
                        type: "LOG_OUTPUT",
                        payload: output
                    })
                }

                if (attacker.data.hitpoints === 0 || defender.data.hitpoints === 0) {
                    clearInterval(interval);

                    if (attacker.livelyUser) {
                        attacker.livelyUser.sendEvent({
                            type: "BATTLE_FINISHED"
                        });
                    }
    
                    if (defender.livelyUser) {
                        defender.livelyUser.sendEvent({
                            type: "BATTLE_FINISHED"
                        });
                    }
                }
            })
    }, 500);
};

function battleTick(attacker, defender) {
    return new Promise((resolve, reject) => {
        const attackerName = attacker.data.username ? attacker.data.username : attacker.data.name;
        const defenderName = defender.data.username ? defender.data.username : defender.data.name;
    
        const attackerHP = attacker.data.hitpoints;
        const defenderHP = defender.data.hitpoints;
    
        const attackerStr = attacker.getStat("Strength").level;
        const attackerAtt = attacker.getStat("Attack").level;
    
        const defenderDef = defender.getStat("Defense").level;
    
        const attackHelp = (Math.random() * attackerAtt + 1) / 99; // 1 ... attackerAtt === 1 ... 99
        const willAttack = parseInt((Math.random() + attackHelp) * 2 + 1) >= 2;
    
        if (!willAttack) return resolve(`${attackerName} missed!`);
    
        // Thanks, Mushini! :D
        const strHelp = ((Math.random() * attackerStr) + 1) / 99 + 1;
        const minDamage = 1 * strHelp;
        const maxDamage = 2 * strHelp;
    
        var actualDamage = parseInt(Math.random() * maxDamage + minDamage);
        if (actualDamage > maxDamage) actualDamage = maxDamage;
    
        defender.hurt(actualDamage);
        defender.save()
            .then(() => {
                var tickText = `${attackerName} struck ${defenderName} for ${actualDamage} with their fist! ${defenderName} has ${defender.data.hitpoints} HP left.`;

                if (defender.data.hitpoints === 0) {
                    tickText += ` ${defenderName} has perished! :(`;
                }

                resolve(tickText);
            })
    })
};