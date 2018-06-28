const heal = require('./Commands/heal');
const hurt = require('./Commands/hurt');
const tile = require('./Commands/tile');
const walk = require('./Commands/walk');
const npc = require('./Commands/npc');
const look = require('./Commands/look');
const attack = require('./Commands/attack');

function CommandInterpreter() {
    this.commands = [heal, hurt, tile, walk, npc, look, attack];

    this.interpret = (player, game, composed) => {
        return new Promise((resolve, reject) => {
            const cmdName = composed.split(" ")[0];
            const command = this.commands.find(cmd => cmd.name === cmdName);
    
            const output = command.effect(player, game, composed)
                .then(output => {
                    resolve(output);
                });
        })
    }
}

module.exports = CommandInterpreter; 