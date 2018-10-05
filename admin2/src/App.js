import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './containers/Home';

import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" exact component={props => <Home {...props} />} />
        </div>
      </Router>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({})
)(App);
