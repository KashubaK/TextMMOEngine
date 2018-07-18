import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    lively: inject(),

    log: [],

    typing: false,
    logsToType: [],
    test: "",

    hasLoggedBefore: false,

    realLog: Ember.observer('lively.state.log', function() {
        const log = this.get('lively.state.log');
        const newLog = log.objectAt(0);

        if (!newLog && newLog !== "") return;

        if (!this.get('typing')) {
            this.set('typing', true);

            this.setLogType(newLog);
        } else {
            this.get('logsToType').pushObject(newLog);
        }
    }),

    // "Welcome to TextScape!"
    setLogType(newLog) {
        this.get('logsToType').removeObject(this.get('logsToType').objectAt(0));
        var current = 0;

        this.set('test', '');

        const typeLog = setInterval(() => {
            const currentString = newLog.substring(0, current);
            this.set('test', currentString) // W, We, Wel, Welc...
            current++;

            if (current > newLog.length) {
                clearInterval(typeLog);

                this.set('typing', false);
                this.set('test', '');
                this.get('log').insertAt(0, currentString);

                if (this.get('logsToType.length') > 0) {
                    this.setLogType(this.get('logsToType.0'));
                }

                if (this.get('log').length < 3) {
                    this.get('log').reverseObjects();
    
                    Ember.run.later(() => {
                        this.get('log').reverseObjects();
                    })
                }
            }
        }, 25);
    },

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
            if (action.payload || action.payload === "") {
                state.log.insertAt(0, action.payload);
            }

            return state;
        });
    }
});
