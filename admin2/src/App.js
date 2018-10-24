import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import MapRoute from './containers/MapRoute';

import { connect } from 'react-redux';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Map, Face, Toys } from '@material-ui/icons'

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const styles = theme => ({
    navigation: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.25)'
    }
})

class App extends Component {
  state = {
    currentRoute: 'Map'
  }

  handleChange(e) {
    e.persist();
    // ?
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <CssBaseline />
        
        <Router>
          <>
            <div className="App">
              <Route path="/map" exact component={props => <MapRoute {...props} />} />
              <Route path="/npcs" exact component={props => <MapRoute {...props} />} />
              <Route path="/items" exact component={props => <MapRoute {...props} />} />
            </div>
                    
            <BottomNavigation
              showLabels
              value={this.state.currentRoute}
              onChange={this.handleChange}
              className={this.props.classes.navigation}
            > 
              <Link to="map">
                <BottomNavigationAction label="Map" icon={<Map />}  />
              </Link>

              <Link to="npcs">
                <BottomNavigationAction label="NPCs" icon={<Face />} />
              </Link>

              <Link to="items">
                <BottomNavigationAction label="Items" icon={<Toys />} />
              </Link>
            </BottomNavigation>
          </>
        </Router>
      </>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({})
)(withStyles(styles)(App));
