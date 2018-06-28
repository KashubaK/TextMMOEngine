# TextMMOEngine

### Ember.js + Node.js + MongoDB

#### (Lively) = Express.js + Socket.io + Mongoose


## Setup

Install [Node.js & NPM](http://nodejs.org/), and [MongoDB](https://www.mongodb.com/download-center#community).

Spin up MongoDB in another terminal tab:

`$ mongod`

`$ git clone https://github.com/kashubak/TextMMOEngine.git`

`$ cd TextMMOEngine`

`$ npm install`

Wait a minute...

`$ cd client`

If you don't have the `ember-cli` installed:

`$ npm install -g ember-cli`

Install the client dependencies:

`$ npm install`

Serve the front-end:

`$ ember s`

Choose the main directory:

`$ cd ..`

Spin up the back-end:

`$ node .`

Now, load up `http://localhost:4200` in your browser and check the console for a `LIVELY_INITIALIZED` event. If you don't see it, something's up.