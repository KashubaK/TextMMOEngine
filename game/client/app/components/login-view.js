import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    lively: inject(),

    badLogin: Ember.computed.alias('lively.state.badLogin'),
    playerCreated: Ember.computed.alias('lively.state.playerCreated'),

    username: "",
    password: "",

    actions: {
        login() {
            const username = this.get('username');
            const password = this.get('password');

            this.get('lively').dispatchServerAction({
                type: "LOG_IN",
                payload: {
                    username,
                    password
                }
            });
        },

        register() {
            const username = this.get('username');
            const password = this.get('password');

            this.get('lively').dispatchServerAction({
                type: "CREATE_PLAYER",
                payload: {
                    username,
                    password
                }
            });
        }
    },

    init() {
        this._super(...arguments);

        const lively = this.get('lively');

        lively.registerEvent("PLAYER_CREATED", (state, action) => {
            state.playerCreated = true;

            return state;
        });

        lively.registerEvent("INCORRECT_LOGIN", (state, action) => {
            state.badLogin = true;

            return state;
        });

        lively.registerEvent("PLAYER_LOGGED_IN", (state, action) => {
            state.badLogin = false;
            
            state.players = action.payload.players;
            state.player = action.payload.player;
            state.tiles = action.payload.tiles;

            return state;
        });
    }
});
