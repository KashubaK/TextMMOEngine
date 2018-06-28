import Service from '@ember/service';

export default Service.extend({
    io: {},

    events: [],

    initialState: {
        readyToSendActions: false,

        actionsToSend: [],
        serverActionsToSend: [],
        ajaxCallsToSend: [],

        log: []
    },

    store: {},
    state: {},

    registerEvent(type, reducer) {
        this.get('events').set(type, reducer);
    },

    dispatchClientAction(action) {
        if (this.get('state.readyToSendActions') === true || action.type === "LIVELY_INITIALIZED") {
            this.get('store').dispatch(action);
        } else {
            this.get('store').dispatch({
                type: "LIVELY_ADD_POST_INIT_ACTION",
                payload: action
            });
        }
    },

    ajax(options, storedResolve, storedReject) {
        return new Promise((resolve, reject) => {
            if (this.get('state.readyToSendActions') === true) {
                if (!options.headers) options.headers = {};
                    
                options.headers['X-Socket-ID'] = this.get('io.id');
        
                $.ajax(options)
                    .done((body) => {
                        console.log("[lively ajax]: Received event:", body);
                        
                        this.dispatchClientAction(body);

                        if (storedResolve) return storedResolve(body.payload);
                        resolve(body.payload);
                    })
                    .fail((err) => {
                        console.error(err);

                        if (storedReject) return storedReject(err);
                        reject(err);
                    })
            } else {
                this.get('store').dispatch({
                    type: "LIVELY_ADD_POST_INIT_AJAX",
                    payload: {
                        options,
                        resolve,
                        reject
                    }
                });
            }
        })
    },

    dispatchServerAction(action) {
        if (this.get('state.readyToSendActions') === true) {
            console.log(`\n[LivelyEmberClient dispatchServerAction]: Dispatching action to server`, action);
            this.get('io').emit("lively_action", action);
        } else {
            this.get('store').dispatch({
                type: "LIVELY_ADD_POST_INIT_SERVER_ACTION",
                payload: action
            });
        }
    },

    stateSubscriber() {
        const newState = this.get('store').getState();
        const oldState = this.get('state');

        const wasntReadyToDispatchActions = oldState.readyToSendActions !== newState.readyToSendActions;

        this.set('state', newState);

        if (wasntReadyToDispatchActions) {
            const actionsToSend = newState.actionsToSend;
            const serverActionsToSend = newState.serverActionsToSend;
            const ajaxCallsToSend = newState.ajaxCallsToSend;

            if (actionsToSend.length > 0) {
                actionsToSend.forEach(postInitAction => {
                    this.dispatchClientAction(postInitAction);
                });

                this.dispatchClientAction({type: "LIVELY_CLEAR_POST_INIT_ACTIONS"});
            }

            if (serverActionsToSend.length > 0) {
                serverActionsToSend.forEach(postInitAction => {
                    this.dispatchServerAction(postInitAction);
                });

                this.dispatchClientAction({type: "LIVELY_CLEAR_POST_INIT_SERVER_ACTIONS"});
            }

            if (ajaxCallsToSend.length > 0) {
                ajaxCallsToSend.forEach(ajaxCall => {
                    this.ajax(ajaxCall.options).then(ajaxCall.resolve, ajaxCall.reject);
                })

                this.dispatchClientAction({type: "LIVELY_CLEAR_POST_INIT_AJAX"});
            }
        }
        
        console.log(`\n[LivelyEmberClient stateSubscriber]: New state`, this.get('state'));
    },

    subscribe(fn) {
        this.get('store').subscribe(fn);
    },

    unsubscribe(fn) {
        this.get('store').unsubscribe(fn);
    },

    rootReducer(state = this.get('initialState'), action) {
        const reducer = this.get('events').get(action.type);

        if (typeof reducer === "function") {
            return reducer(Object.assign({}, state), action);
        } else {
            console.error(`\n[LivelyEmberClient rootReducer]: Unknown or incorrectly registered event: ${action.type}. Returning previous state.`);
            return state;
        }
    },

    initialize() {
        const store = Redux.createStore((state, action) => {
            return this.rootReducer(state, action);
        });

        store.subscribe(() => {
            this.stateSubscriber();
        });

        this.set('store', store);

        this.registerEvent("LIVELY_INITIALIZED", (state, action) => {
            state.readyToSendActions = true;

            return state;
        });

        this.registerEvent("LIVELY_ADD_POST_INIT_ACTION", (state, action) => {
            state.actionsToSend.pushObject(action.payload);

            return state;
        });

        this.registerEvent("LIVELY_ADD_POST_INIT_AJAX", (state, action) => {
            state.ajaxCallsToSend.pushObject(action.payload);

            return state;
        });

        this.registerEvent("LIVELY_ADD_POST_INIT_SERVER_ACTION", (state, action) => {
            state.serverActionsToSend.pushObject(action.payload);

            return state;
        });

        this.registerEvent("LIVELY_CLEAR_POST_INIT_SERVER_ACTIONS", (state, action) => {
            state.serverActionsToSend = [];

            return state;
        });

        this.registerEvent("LIVELY_CLEAR_POST_INIT_AJAX", (state, action) => {
            state.ajaxCallsToSend = [];

            return state;
        })

        this.registerEvent("LIVELY_CLEAR_POST_INIT_ACTIONS", (state, action) => {
            state.actionsToSend = [];

            return state;
        });

        this.set('io', io(window.EmberENV.API_URL));

        this.get('io').on('lively_event', (event) => { 
            console.log(`\n[LivelyEmberClient livelyEventListener]: Received event`, event);
            
            this.dispatchClientAction(event);
        });

        this.get('io').on('lively_error', (err) => {
            console.error(err);
        })
    },

    init() {
        this._super();

        this.initialize();
    }
});
