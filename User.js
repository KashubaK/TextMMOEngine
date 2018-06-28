const v4 = require('uuid').v4;
const Immutable = require('immutable');

function User(socket, data) {
    this._id = v4();

    this.socket = socket;
    this.data = data; // For your User model, e.g. { _id: ..., username: "test123", password: "fas98dhf3892hfdsf", ... }

    this.sendEvent = eventPayload => {
        this.socket.emit('lively_event', eventPayload);
    };

    this.sendError = (actionPayload, error) => this.socket.emit('lively_error', {actionPayload, error});

    this.subscriptions = Immutable.List();

    this.subscribeTo = (document) => {
        const modelName = document.constructor.modelName;
        const _id = document._id;

        const subscription = `${modelName}#${_id}`;

        this.subscriptions = this.subscriptions.push(subscription);
        this.socket.join(subscription);
    };

    this.unsubscribeFrom = (document) => {
        const modelName = document.constructor.modelName;
        const _id = document._id;

        const subscription = `${modelName}#${_id}`;

        this.subscriptions = this.subscriptions.filter(sub => sub !== subscription);
        this.socket.leave(subscription);
    };

    this.clearSubscriptions = () => {
        this.subscriptions.forEach((subscription) => {
            this.socket.leave(subscription);
        });

        this.subscriptions = this.subscriptions.clear();
    };

    return this;
}

module.exports = User;