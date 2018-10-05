import SocketIOClient from 'socket.io-client';
import { createStore } from 'redux';
import axios from 'axios';

class Lively {
    io = {};

    events = [];

    initialState = {
        readyToSendActions: false,

        actionsToSend: [],
        serverActionsToSend: [],
        ajaxCallsToSend: [],

        tiles: [],
        items: [],
        npcs: [],
        stats: [],
        worldTiles: [],
        worldItems: [],
        worldNPCs: [],
        statProgresses: [],

        tile: {}
    };

    store = {};
    state = {};

    registerEvent(type, reducer) {
        this.events[type] = reducer;
    }

    dispatchClientAction(action) {
        if (this.state.readyToSendActions === true || action.type === "LIVELY_INITIALIZED") {
            this.store.dispatch(action);
        } else {
            this.store.dispatch({
                type: "LIVELY_ADD_POST_INIT_ACTION",
                payload: action
            });
        }
    }

    ajax(options, storedResolve, storedReject) {
        return new Promise((resolve, reject) => {
            if (this.state.readyToSendActions === true) {
                if (!options.headers) options.headers = {};
                    
                options.headers['X-Socket-ID'] = this.io.id;

                axios(options, options.data)
                    .then(body => {
                        console.log("[lively ajax]: Received event:", body);
                        
                        if (body.action && body.type) {
                            this.dispatchClientAction(body);
                        }

                        if (storedResolve) return storedResolve(body);
                        resolve(body.data);
                    })
                    .catch(err => {
                        console.error(err);

                        if (storedReject) return storedReject(err);
                        reject(err);
                    })
            } else {
                this.store.dispatch({
                    type: "LIVELY_ADD_POST_INIT_AJAX",
                    payload: {
                        options,
                        resolve,
                        reject
                    }
                });
            }
        })
    }

    dispatchServerAction(action) {
        if (this.state.readyToSendActions === true) {
            console.log(`\n[LivelyReactClient dispatchServerAction]: Dispatching action to server`, action);
            this.io.emit("lively_action", action);
        } else {
            this.store.dispatch({
                type: "LIVELY_ADD_POST_INIT_SERVER_ACTION",
                payload: action
            });
        }
    }

    handlePostInitActions() {
        const newState = this.store.getState();

        if (newState.readyToSendActions === false) return;
        
        const oldState = this.state;

        const wasntReadyToDispatchActions = oldState.readyToSendActions !== newState.readyToSendActions;

        this.state = newState;

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
        
        console.log(`\n[LivelyReactClient stateSubscriber]: New state`, this.state);
    }

    subscribe(fn) {
        this.store.subscribe(fn);
    }

    unsubscribe(fn) {
        this.store.unsubscribe(fn);
    }

    rootReducer(state, action) {
        const reducer = this.events[action.type];

        if (typeof reducer === "function") {
            return reducer(Object.assign({}, state), action);
        } else if (action.type.indexOf('@@redux') === -1) {
            console.error(`\n[LivelyReactClient rootReducer]: Unknown or incorrectly registered event: ${action.type}. Returning previous state.`);
        }
        
        return state;
    }

    constructor() {
        const store = createStore((state = this.initialState, action) => {
            return this.rootReducer(state, action);
        });

        store.subscribe(() => {
            this.handlePostInitActions();
        });

        this.store = store;

        this.registerEvent("LIVELY_INITIALIZED", (state, action) => {
            state.readyToSendActions = true;

            return state;
        });

        this.registerEvent("LIVELY_ADD_POST_INIT_ACTION", (state, action) => {
            state.actionsToSend.push(action.payload);

            return state;
        });

        this.registerEvent("LIVELY_ADD_POST_INIT_AJAX", (state, action) => {
            state.ajaxCallsToSend.push(action.payload);

            return state;
        });

        this.registerEvent("LIVELY_ADD_POST_INIT_SERVER_ACTION", (state, action) => {
            state.serverActionsToSend.push(action.payload);

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

        const host = window.location.hostname + ":8000";
        this.io = SocketIOClient(host);

        this.io.on('lively_event', (event) => { 
            console.log(`\n[LivelyClient livelyEventListener]: Received event`, event);
            
            this.dispatchClientAction(event);
        });

        this.io.on('lively_error', (err) => {
            console.error(err);
        })
    }
}

const lively = new Lively();

export default lively;
