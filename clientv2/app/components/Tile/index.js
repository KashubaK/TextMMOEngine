/**
 *
 * Tile
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { lively } from '../../utils/lively';
import './Tile.css';

/* eslint-disable react/prefer-stateless-function */
class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.state = { tile: props.tile, player: lively.state.player }

    this.determineTileStyle = this.determineTileStyle.bind(this);
  }

  componentDidMount() {
    lively.subscribe(() => {
      this.setState({
          player: lively.state.player
      });
    })
  }

  determineTileStyle() {
    var style = {};
    const tile = this.state.tile;

    if (!tile) style = style.borderColor = transparent;
  
    switch (tile.material) {
      case "grass":
        style.backgroundColor = "#7fb755"
        break;
      case "earth":
        style.backgroundColor = "#79563a"
        break;
      case "wood":
        style.backgroundColor = "#bb975d"
        break;
      case "stone":
        style.backgroundColor = "#ccc"
        break;
    }
  
    if (this.state.player.position === tile.position) {
      style.borderStyle = "dashed"; 
      style.zIndex = 0;
      style.boxShadow = "0 0 8px rgba(0, 0, 0, 1)";
    }

    return style;
  }

  render() {
    return <div className="tile" style={this.determineTileStyle(this.state.tiles)} />;
  }
}

Tile.propTypes = {};

export default Tile;
