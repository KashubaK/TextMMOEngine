# TextMMOEngine

### React + Node.js + MongoDB

#### (Lively) = Express.js + Socket.io + Mongoose

## Setup

Install [Node.js & NPM](http://nodejs.org/), and [MongoDB](https://www.mongodb.com/download-center#community).

Spin up MongoDB in another terminal tab:

`mongod`

Now let's get the project working. First we'll need the source:

`git clone https://github.com/kashubak/TextMMOEngine.git`

`cd TextMMOEngine`

Install the back-end dependencies

`yarn`

Wait a minute...

`node .`

Now we can get the admin app running.

`cd admin2`

create-react-app 2 was used to spin up the app. To get it set up, simply install dependencies:

`yarn`

Then start the app:

`yarn start`

Now, load up `http://localhost:3000` in your browser and check the console for a `LIVELY_INITIALIZED` event. If you don't see it, something's up.
