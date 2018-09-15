/**
 *
 * Log
 *
 */

import React from 'react';
import { lively } from '../../utils/lively';


import './Log.css';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class Log extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      log: []
    }
  }

  componentDidMount() {
    lively.subscribe(() => {
      this.setState({
        log: lively.state.log
      })
    })
  }

  render() {
    const messages = this.state.log.map((msg, i) => {
      return <div id={`message${i}`} className={msg.length > 0 ? "message" : "message blank"}>{msg}</div>
    })

    return (
      <div className="log">
        {messages}
      </div>
    );
  }
}

Log.propTypes = {};

export default Log;
