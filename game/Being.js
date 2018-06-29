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

    this.getItemFromEquipment = equipTo => this.data.equipment.find(item => item.item.equipTo === equipTo);

    this.removeItemFromEquipment = item => {
        this.addItemToInventory(item);
        this.data.equipment.splice(this.data.equipment.indexOf(item), 1);
    }

    this.addItemToInventory = item => this.data.inventory.push(item);

    this.getStat = statName => this.data.stats.find(stat => stat.stat.name === statName);

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