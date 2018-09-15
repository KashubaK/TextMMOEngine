/**
 *
 * Map
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Tile from '../Tile';

import { lively } from '../../utils/lively';

import './Map.css';

/* eslint-disable react/prefer-stateless-function */
class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiles: lively.state.tiles
    }
  }

  componentDidMount() {
    lively.subscribe(() => {
      this.setState({
          tiles: lively.state.tiles
      });
    })
  }

  render() {
    const player = this.state.player;
    const tiles = [];
    var longestDimension = -1;

    for (var i in this.state.tiles) {
      const tile = this.state.tiles[i];
      const coords = tile.position.split(",");

      if (!tiles[coords[1]]) tiles[coords[1]] = [];
      tiles[coords[1]][coords[0]] = <Tile tile={tile} />

      if (tiles[coords[1]].length > longestDimension) longestDimension = tiles[coords[1]].length;
    }

    if (longestDimension < tiles.length) longestDimension = tiles.length;

    return (
      <div className="map-container">
        <div className="map" style={{width: longestDimension * 16}}>
          {tiles}
        </div>
      </div>
    );
  }
}

Map.propTypes = {};

export default Map;
