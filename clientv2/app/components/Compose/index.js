/**
 *
 * Compose
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { lively } from '../../utils/lively';

import './Compose.css';

/* eslint-disable react/prefer-stateless-function */
class Compose extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commandHistory: [],
      currentCommandHistoryIndex: -1,
      compose: "",
      typing: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  sendCommand() {
    const command = this.state.compose;

    lively.dispatchServerAction({
      type: "SEND_COMMAND",
      payload: command
    });

    this.setState(prevState => {
      return {
        compose: "",
        commandHistory: [command, ...prevState.commandHistory]
      }
    })
  }

  handleKeyUp(e) {
    if (e.key === "ArrowDown") {
      this.prevCmdHistory();
    } else if (e.key === "ArrowUp") {
      this.nextCmdHistory();
    } else if (e.key === "Enter") {
      this.sendCommand();
    }
  }

  prevCmdHistory() {
    const targetCmdHistory = this.state.currentCommandHistoryIndex - 1;
    const command = this.state.commandHistory[targetCmdHistory];

    if (command) {
      this.setState({
        compose: command,
        currentCommandHistoryIndex: targetCmdHistory
      });
    } else {
      this.setState({
        compose: "",
        currentCommandHistoryIndex: -1
      });
    }
  }

  nextCmdHistory() {
    const targetCmdHistory = this.state.currentCommandHistoryIndex + 1;
    const command = this.state.commandHistory[targetCmdHistory];

    if (command) {
      this.setState({
        compose: command,
        currentCommandHistoryIndex: targetCmdHistory
      });
    } else {
      this.setState({
        compose: this.state.commandHistory[this.state.commandHistory.length - 1],
        currentCommandHistoryIndex: this.state.commandHistory.length - 1
      });
    }
  }
  
  handleChange(e) {
    this.setState({
      compose: e.target.value
    })
  }

  render() {
    return (
      <div className="compose">
        <input value={this.state.compose} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
      </div>
    );
  }
}

Compose.propTypes = {};

export default Compose;
