import Controller from '@ember/controller';
import { inject } from '@ember/service'

export default Controller.extend({
    lively: inject(),

    init() {
        this._super();

        const lively = this.get('lively');
        
        lively.registerEvent("PLAYER_UPDATED", (state, action) => {
            state.player = action.payload;

            return state;
        })
    }
});
