function Being(data, livelyUser) {
    this.livelyUser = livelyUser;
    this.data = data;

    this.interact = target => {
        // attack
        // go
    };

    this.chat = message => {

    };

    this.go = tile => {

    };

    this.equip = item => {

    };
    
    this.getStat = statName => this.data.stats.find(stat => stat.stat.name === statName);
    this.rewardExp = (statName, exp) => {
        const stat = this.getStat(statName);
        if (!stat) throw `${statName} Stat doesn't exist on ${this.data.npcData ? this.data.npcData.name : this.data.username}.`

        stat.exp += exp;

        this.livelyUser.sendEvent({
            type: "LOG_OUTPUT",
            payload: `Receieved ${exp} ${statName} exp.`
        })
    }

    this.getItemFromEquipment = equipTo => this.data.equipment.find(item => item.item.equipTo === equipTo);
    this.removeItemFromEquipment = item => {
        this.addItemToInventory(item);
        this.data.equipment.splice(this.data.equipment.indexOf(item), 1);
    };

    this.addItemToInventory = item => this.data.inventory.push(item);
    this.getItemFromInventory = itemName => this.data.inventory.find(item => item.item.name === itemName);
    this.removeItemFromInventory = item => {
        this.data.inventory.splice(this.data.inventory.indexOf(item), 1);
    }


    this.heal = hitpoints => {
        this.data.hitpoints += hitpoints;

        const hp = this.getStat("Hitpoints");
 
        if (this.data.hitpoints > hp.level) {
            this.data.hitpoints = hp.level;
        }
    }

    this.hurt = hitpoints => {
        this.data.hitpoints -= hitpoints;

        console.log(`${this.data.name}: ${this.data.hitpoints}`)

        if (this.data.hitpoints < 0) {
            this.data.hitpoints = 0;

            // this.die()
        }
    }

    this.changePosition = pos => {
        this.data.position = pos;
    }

    this.save = () => this.data.save();

    this.sendUpdate = () => {
        this.livelyUser.sendEvent({
            type: "PLAYER_UPDATED",
            payload: this.data
        })
    }
}

module.exports = Being;