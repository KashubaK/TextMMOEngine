/**
 *
 * Game
 *
 */
import { lively } from '../../utils/lively';

import Log from '../Log';
import Compose from '../Compose';
import Login from '../Login';
import Map from '../Map';

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class Game extends React.Component {
  constructor(props) {
    super(props);

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

    lively.registerEvent("TILES_CREATED", (state, action) => {
      state.tiles = state.tiles.concat(action.payload);

      return state;
    })

    lively.registerEvent("TILE_UPDATED", (state, action) => { 
        state.tiles = state.tiles.map(tile => {
            if (tile._id === action.payload._id) {
                return action.payload;
            } else {
                return tile;
            }
        })

        return state;
    })

    lively.registerEvent("LOG_OUTPUT", (state, action) => {
        if (action.payload || action.payload === "") {
            state.log = [action.payload, ...state.log];
        }

        return state;
    });

    lively.registerEvent("PLAYER_UPDATED", (state, action) => {
        state.player = action.payload;

        return state;
    })

    this.state = {
      tiles: [],
      player: null
    };
  }

  componentDidMount() {
    lively.subscribe(() => {
        this.setState({
            player: lively.state.player,
            tiles: lively.state.tiles
        });
    })
  }

  render() {
    return (
      <div className="game">
        {!this.state.player && <Login /> }

        {this.state.player && <Map />}
        {this.state.player && <Log />}
        {this.state.player && <Compose />}
      </div>
    );
  }
}

Game.propTypes = {};

export default Game;
