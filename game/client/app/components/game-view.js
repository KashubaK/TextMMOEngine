import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    lively: inject(),

    log: Ember.computed.alias('lively.state.log'),
    compose: "",

    actions: {
        sendCommand() {
            const compose = this.get('compose');

            this.get('lively').dispatchServerAction({
                type: "SEND_COMMAND",
                payload: compose
            });

            this.set('compose', "");
        }
    },

    init() {
        this._super(...arguments);

        const lively = this.get('lively');

        lively.registerEvent("LOG_OUTPUT", (state, action) => {
            state.log.pushObject(action.payload);

            return state;
        });
    }
});
