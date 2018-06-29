import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    classNames: ["map-container"],
    
    lively: inject(),

    player: Ember.computed.alias('lively.state.player'),

    style: "",
    highestDimension: 0,
    tiles: [],

    sortTiles() {
        const tiles = this.get('lively.state.tiles');
        const sorted = [];

        var longestRowLength = 0;
        var highestColumnHeight = 0;

        tiles.forEach(tile => {
            const coords = tile.position.split(",");

            if (!sorted[coords[0]]) {
                sorted[coords[0]] = [];
            }

            sorted[coords[0]][coords[1]] = tile;

            longestRowLength = longestRowLength < sorted[coords[0]].length ? sorted[coords[0]].length : longestRowLength;
        });

        highestColumnHeight = sorted.length;
        
        this.set('tiles', sorted);
        this.set('highestDimension', highestColumnHeight > longestRowLength ? highestColumnHeight : longestRowLength);

        this.set('style', Ember.String.htmlSafe(`height: ${this.get('highestDimension') * 18}px; width: ${this.get('highestDimension') * 18}px;`));
    },

    sortTilesUponMapChange: Ember.observer('lively.state.tiles', function() {
        this.sortTiles();
    }),

    init() {
        this._super(...arguments);

        this.sortTiles();

        const lively = this.get('lively');

        lively.registerEvent("TILE_CREATED", (state, action) => {
            state.tiles.pushObject(action.payload);

            return state;
        })

        lively.registerEvent("TILE_UPDATED", (state, action) => { 
            state.tiles = state.tiles.map(tile => {
                if (tile._id === action.payload._id) {
                    console.log("Found and updated tile")
                    return action.payload;
                } else {
                    return tile;
                }
            })

            return state;
        })
    }
});
