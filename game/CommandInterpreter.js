const _ = require('lodash');
const fs = require('fs');
const path = require('path');

function CommandInterpreter() {
    this.commands = [];
    this.uses = [];

    this.getCommand = cmdName => this.commands.find(command => command.name === cmdName);
    this.getUse = itemName => this.uses.find(use => use.name === itemName);

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
    };

    this.loadCommands = () => {
        const pathToCommands = __dirname + "/Commands";

        const walkSync = (d) => {
            if (fs.statSync(d).isDirectory()) {
                return fs.readdirSync(d).map(f => {
                    return walkSync(path.join(d, f)); 
                })
            } else {
                return d; // A file
            }
        };

        _.forEach(walkSync(pathToCommands), (commandFile) => {
            const command = require(commandFile);
            console.log(`Loaded command ${command.name}`)
            this.commands.push(command);
        });
    };

    this.loadUses = () => {
        const pathToUses = __dirname + "/Uses";

        const walkSync = (d) => {
            if (fs.statSync(d).isDirectory()) {
                return fs.readdirSync(d).map(f => {
                    return walkSync(path.join(d, f)); 
                })
            } else {
                return d; // A file
            }
        };

        _.forEach(walkSync(pathToUses), (useFile) => {
            const use = require(useFile);
            console.log(`Loaded use ${use.name}`)
            this.uses.push(use);
        });
    };

    this.loadCommands();
    this.loadUses();
}

module.exports = CommandInterpreter; 