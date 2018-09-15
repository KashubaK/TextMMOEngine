import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    lively: inject(),

    commandHistory: [],
    currentCommandHistoryIndex: -1,

    log: Ember.computed.alias('lively.state.log'),

    typing: false,
    logsToType: [],
    typingLog: "",

    realLog: Ember.observer('lively.state.log', function() {
        return;

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

        this.set('typingLog', '');

        const typeLog = setInterval(() => {
            const currentString = newLog.substring(0, current);
            this.set('typingLog', currentString) // W, We, Wel, Welc...

            current++;

            if (current > newLog.length) {
                clearInterval(typeLog);

                this.set('typing', false);
                this.set('typingLog', '');
                this.get('log').insertAt(0, currentString);

                if (this.get('logsToType.length') > 0) {
                    this.setLogType(this.get('logsToType.0'));
                }
                
                this.get('log').reverseObjects();

                Ember.run.later(() => {
                    this.get('log').reverseObjects();
                })
            }
        }, 25);
    },

    compose: "",

    actions: {
        handleKeyUp(value, e) {
            if (e.key === "ArrowDown") {
                this.send('prevCmdHistory')
            } else if (e.key === "ArrowUp") {
                this.send('nextCmdHistory')
            }
        },

        nextCmdHistory() {
            this.set('currentCommandHistoryIndex', this.get('currentCommandHistoryIndex') + 1);

            const command = this.get('commandHistory').objectAt(this.get('currentCommandHistoryIndex'));

            if (command) {
                console.log(command)
                this.set('compose', command)
            } else {
                this.set('currentCommandHistoryIndex', this.get('commandHistory.length') - 1);
            }
        },

        prevCmdHistory() {
            this.set('currentCommandHistoryIndex', this.get('currentCommandHistoryIndex') - 1);

            const command = this.get('commandHistory').objectAt(this.get('currentCommandHistoryIndex'));

            if (command) {
                console.log(command)
                this.set('compose', command)
            } else {
                this.set('currentCommandHistoryIndex', -1);
                this.set('compose', "")
            }
        },

        sendCommand() {
            const compose = this.get('compose');

            this.get('commandHistory').insertAt(0, compose);

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
