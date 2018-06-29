const Immutable = require('immutable');
const Being = require('./Being');

const CommandInterpreter = require('./CommandInterpreter');

function Game(lively) {
    this.lively = lively;
    this.commandInterpreter = new CommandInterpreter();

    this.players = new Immutable.List();
    this.npcs = new Immutable.Map();
    this.worldNpcs = new Immutable.Map();
    this.objects = new Immutable.List();
    this.tiles = new Immutable.Map();

    this.setTile = tile => {
        this.tiles = this.tiles.set(tile.id, tile);
    }

    this.setNpc = npc => {
        this.npcs = this.npcs.set(npc.id, npc);
    }

    this.setWorldNpc = worldNpc => {
        this.worldNpcs = this.worldNpcs.set(worldNpc.id, worldNpc);
    }

    this.getPlayers = () => {
        const players = [];

        this.players.forEach(player => {
            players.push(player.livelyUser.data);
        })

        return players;
    };

    this.getPlayer = player_id => this.players.find(player => player.livelyUser.data._id === player_id);

    this.addPlayer = (data, livelyUser) => {
        const player = new Being(data, livelyUser);
        this.players = this.players.push(player);
    };

    this.interpretCommand = function(player, cmd) {
        return this.commandInterpreter.interpret(player, this, cmd);
    };

    this.removePlayer = player => {
        this.players = this.players.splice(this.players.indexOf(player), 1);
    };

    this.init = () => {
        const Tile = this.lively.getModel("Tile");
        const WorldNPC = this.lively.getModel("WorldNPC");

        Tile.find({})
            .exec((err, tiles) => {
                if (err) throw err;

                tiles.forEach(tile => { 
                    this.tiles = this.tiles.set(tile._id, tile);

                    console.log(`Added tile ${tile.material}:${tile.type} at [${tile.position}]`);
                });

                WorldNPC.find({})
                    .exec((err, npcs) => {
                        if (err) throw err;

                        npcs.forEach(npc => { 
                            const npcBeing = new Being(npc);
                            this.worldNpcs = this.worldNpcs.set(npc.id, npcBeing);

                            console.log(`Added npc ${npc.npcData.name} at [${npc.position}]`);
                        });
                    })
            })
    }

    this.init();
}

module.exports = Game;