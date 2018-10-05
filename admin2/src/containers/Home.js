import React from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';

import TileList from '../components/TileList/TileList';
import Map from '../components/Map/Map';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Grid container spacing={40} justify="center">
                {/* game */}
                <Grid item xs={8}>
                    <Map />
                </Grid>

                {/* side pane */}
                <Grid item xs={4}>
                    <TileList />
                </Grid>
            </Grid>
        )
    }
}

export default connect(
    state => ({

    }),
    dispatch => ({

    })
)(Home);