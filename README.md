# Lively

### Node.js + Express.js + Socket.io + Mongoose

A streamlined solution for back-end to front-end realtime communication, and back-end structure.

## Back-end

Lively is in an early experimental stage - it’s mainly to help myself structure my node back-ends. I figured since it is so helpful to myself, it could possibly help others, too.
Setup

It’s ez.

`$ git clone https://github.com/kashubak/Lively.git`

`$ cd Lively`

`$ npm install`

In your index.js, make sure your mongoose connection options are correct, alongside the paths to your actions and schemas folders:

```javascript
const Lively = require('lively');
const mongoose = require('mongoose');

mongoose.connect('yourConnectionURi');

const app = new Lively(8000, mongoose, __dirpath + '/actions', __dirpath + '/schemas');
```

`$ npm start` or `$ node .`

That's it. You can add mongoose Schemas to your `/schemas` folder, and Lively Actions in this convention: `/actions/<Schema>/<ACTION_NAME>.js`. Lively will automatically load all of your actions and schemas.

## Schemas

Before you can add actions that play with Mongoose, you need to define some Schemas. There is no Lively overhead here, simply add a file `<ModelName>.js` into your `/schemas` folder.

For example, a Todo schema:

```javascript
// <your app>/schemas/Todo.js
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completeBy: Date,
    images: [String]
});

TodoSchema.plugin(<any plugin you want>);

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
```

Some inconsistencies here: each file in the `/schemas` folder returns a `MongooseModel`. Also, it's not necessary for Lively to pull the model name from the filename, as it's very easy to pull it from the exported Model. But whatever, I guess, it forces nice file structure.

## Actions

Actions are simple objects:

```javascript
module.exports = {
    schema: {},
    
    fn(payload, sender, lively, Model) {
        return new Promise((resolve, reject) => {
            let condition = false;
            if (condition) reject("Any error");
            
            // Do anything
            
            sender.sendEvent({
                type: "AN_EVENT",
                payload: {
                    foo: "bar"
                }
            });
			
            resolve(); // Job is done
        });
    }
};
```

### payload

On the front-end module lies a method called `dispatchServerAction(event)`. The event object has two keys: `type` and `payload`. This is modelled after Redux actions for simplicity, and intuition amongst the target audience here. Your `payload` parameter is the `payload` key on the `event` object sent when you call `dispatchServerAction`.

### sender

Sender is a `LivelyUser` stored in the `lively.users` array, automatically pulled by the `socket.id` upon sending an action from the front-end.

### lively 

Not much to explain here - lively is the entire lively instance. Since lively has a relatively low footprint, and has a powerful api to expand the functionality of your actions, it’s there. You can do all sorts of things with this object.

### Model

The Model of which your action is nested under, in your `actions` folder, injected by Lively.

So say your action is under `<yourapp>/actions/Todo/ACTION.js`, your `fn()` will have the following parameters:

`fn(payload, sender, lively, Todo)`

Since `Todo` is a Mongoose `Model`, you can call methods such as:

`Todo.findByIdAndUpdate`, `Todo.findOne`, etc.

#### Asynchronous Actions

Lively handles actions one-by-one, thus requiring `Action.fn` to return a Promise. It pushes Actions to the `Lively.actionQueue` if there’s a `Lively.currentAction`, which gets destroyed upon an action’s `resolve` or `reject` call.

#### Express Endpoints

Actions can also be endpoints, by declaring some extra keys in your action. Here’s a quick example that returns a simple object:

```javascript
module.exports =  {
    schema: {},

    endpoint: '/auth', // auto-prefixed by '/api'
    method: 'post', // lowercase, as Lively calls `expressApp[action.method](action.fn)`
    middleware: function(req, res, next) { next(); },

    fn(req, res, lively, Model) {
        return new Promise((resolve, reject) => {
            res.json({
                hello: 'world'
            });

            resolve();
       });
   }
}
```

Some important differences to note here. There are three new keys: `endpoint`, `method`, and `middleware`. They’re pretty self explanatory, but keep in mind: Lively adds a prefix `/api` to your endpoint, and the `method` key must match the function called on an `express` construction.

For example, in a standard express API:

```javascript
const app = express();

app.post( … );
app.get( … );

app.listen(8080);
```

Upon loading actions, Lively checks if there’s an `endpoint` key on the action object, and declares it like so:

```javascript
app[action.method] // app.<post, get, put, del, etc.>
	(action.fn) // handles the route
```

It’s also important to note the changes in the first two parameters: `payload` and `sender` have now become `req` and `res`. I need to think more about how to handle routes, in terms of structure and asynchrony. Not really sure if it’s necessary to add route handling to the `lively.actionQueue`, and it’s kind of hard to determine where routes are in your `/actions` folder unless your actions are named like `GET_TODOS.js`, `POST_TODO.js`, etc. More on this later as I use Lively in my projects.

#### But I want to send realtime events to who called the endpoint!

You can do that. Lively stores users based on their `socket.id`, which is sent with all ajax calls thanks to its proxy `lively.ajax` method on the front-end module. You can find this at `req.headers[‘x-socket-id’]`.

Now that we know how to find the user’s `socket.id`, we can call `find` on `lively.users` to get the `LivelyUser`. Like so:

```javascript
const sender = lively.users.find(user => user.socket.id === req.headers['x-socket-id']);

if (sender) {
    sender.sendEvent({
        type: 'WOO_HOO',
        payload: { foo: 'bar' }
    })
}
```

## Lively Users

A `LivelyUser` is a simple class with some very important methods:

### sendEvent(event)

Sends an object modelled after Redux Actions to the front-end. Must be formatted as such, so that the front-end module can handle it properly. For example:

```javascript
user.sendEvent({
    type: "CONSTANT_CASE",
    payload: {
        foo: "hello",
        bar: "world"
    }
});
```

The event is then handled by your registered event handler, which we’ll get into later.

### subscribeTo(MongooseDocument)

Constructs a subscription string, of the syntax `<Model.modelName>#<Document._id>`.

It’s a simple function, which just does:

```javascript
this.socket.join('<document model>#<document._id>')
```

It also adds the subscription to the `User.subscriptions` array, which you can use to track what a user is currently looking at.

In your GET endpoints, you can loop over objects retrieved from the DB, and call `sender.subscribeTo` on each of them, so that in your `POST` endpoints or actions that update that document, you can call `lively.sendEventToSubscribers(document, event)`, and users who have called `subscribeTo` on that document will receive the `event`.

### unsubscribeFrom(MongooseDocument)

Calls `this.socket.leave` on a document's subscription string, and removes it from the `User.subscriptions` array.

### Data

Each User has two important keys of data, too:

#### data

User data. So when a User logs in (however you build that mechanism), you should store that user data within this key.

#### socket 

When `io.on('connection', socket => … )` is fired, that `socket` object is stored in a new User object.

## Front-end

#### Ember.js + Socket.io + Redux

The front-end module can be found under `Lively/client/lively.js`.

### Setup

This module is an Ember service, so just copy and paste it into your `app/services` folder, and inject it into any component/controller/route/etc that needs it.

Upon initialization of the service, it calls `io(window.EmberENV.API_URL)`. So you'll need to add your `API_URL` to your Ember front-end `config/environment.js` file.

Look in the logs, and see if a `LIVELY_INITIALIED` event is received. If so, then Lively succesfully connected to the back-end, has a LivelyUser created, and is ready to send and receive events.

#### Dependencies

The Lively front-end module depends on the `redux` and `socket.io-client` npm packages, so install them in your Ember app, and include them in your `ember-cli-build.js` file.

### Registering Reactions to back-end Events

```javascript
import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    lively: inject(),

    init() {
        this._super(...arguments);
        
        const lively = this.get('lively');

        lively.registerEvent('AN_EVENT', (state, action) => {
            state.foo = action.payload.bar;   
            
            return state;
        });
    });
});
```

As you can see, `registerEvent` requires two parameters: an event name, and a Redux Reducer. The first parameter reflects the `event.type` sent by the back-end upon calling `lively.sendEvent(event)`, so the module can determine which reducer to run upon receiving an event. The second parameter is a pure function that returns an updated clone of the current state, see “Redux Reducers”. Lively handles cloning the state for you, so you don’t have to worry about immutability. Just mutate the `state`, and return it.

#### Pulling data from the state

The state is stored in `lively.state`. You can add observers to individual keys on the state, or a simple `Ember.computed.alias(‘lively.state.foo’)` works too. Thanks, Ember! :)

### Dispatching Actions

What, you want to communicate with the back-end? Simply call `lively.dispatchServerAction`:

```javascript
aFunction() {
    this.get('lively').dispatchServerAction({
        type: 'FOO',
        payload: 'bar'
    });
}
```

Your back-end actions will fire events, so make sure you have handlers registered. Otherwise, Lively will log an error saying that your handler is incorrectly registered.

### Dispatching Client Actions

Sometimes, you’ll have events registered that you want to fire without any server communication. This is most often used for client state mutation, i.e. keeping track of a collapsed view, or if a sidenav is open or not. You can do this by calling `registerEvent` to define the handler, and then call `dispatchClientAction` instead of `dispatchServerAction`.

Check it, yo:

```javascript
const lively = this.get('lively');

lively.registerEvent('VIEW_TOGGLED', (state, action) => {
    state.viewToggled = action.payload;
    
    return state;
});

// You can do this wherever, either in a component Action or whatever. As long as the event handler is registered correctly beforehand!
lively.dispatchClientAction({
    type: 'VIEW_TOGGLED',
    payload: lively.state.viewToggled ? false : true
});
```