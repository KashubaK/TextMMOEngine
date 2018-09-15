/**
 *
 * Login
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { lively } from '../../utils/lively';

/* eslint-disable react/prefer-stateless-function */
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    }

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  
  login() {
    lively.dispatchServerAction({
      type: "LOG_IN",
      payload: {
        username: this.state.username,
        password: this.state.password
      }
    })
  }

  register() {
    lively.dispatchServerAction({
      type: "CREATE_PLAYER",
      payload: {
        username: this.state.username,
        password: this.state.password
      }
    })
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
  }

  render() {
    return (
      <div className="login">
        <input value={this.state.username} onChange={this.handleUsernameChange} />
        <input value={this.state.password} onChange={this.handlePasswordChange} />

        <button onClick={this.login}>Login</button>
        <button onClick={this.register}>Register</button>
      </div> 
    );
  }
}

Login.propTypes = {};

export default Login;
