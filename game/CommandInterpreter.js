const heal = require('./Commands/heal');
const hurt = require('./Commands/hurt');
const tile = require('./Commands/tile');
const walk = require('./Commands/walk');
const npc = require('./Commands/npc');
const look = require('./Commands/look');
const attack = require('./Commands/attack');
const item = require('./Commands/item');
const stat = require('./Commands/stat');
const itemattr = require('./Commands/itemattr');
const npcattr = require('./Commands/npcattr');
const npcstat = require('./Commands/npcstat');
const playerstat = require('./Commands/playerstat');
const spawnnpc = require('./Commands/spawnnpc');
const spawnitem = require('./Commands/spawnitem');
const pickup = require('./Commands/pickup');
const equip = require('./Commands/equip');
const npcdrop = require('./Commands/npcdrop');

function CommandInterpreter() {
    this.commands = [heal, hurt, tile, walk, npc, look, attack, item, itemattr, npcattr, npcstat, spawnnpc, stat, playerstat, spawnitem, pickup, equip, npcdrop];

    this.interpret = (player, game, composed) => {
        return new Promise((resolve, reject) => {
            const cmdName = composed.split(" ")[0];
            const command = this.commands.find(cmd => cmd.name === cmdName);

            if (!command) return resolve(`Command ${cmdName} doesn't exist.`);
    
            const output = command.effect(player, game, composed)
                .then(output => {
                    resolve(output);
                });
        })
    }
}

module.exports = CommandInterpreter; 