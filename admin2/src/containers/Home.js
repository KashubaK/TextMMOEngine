import React from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';

import TileList from '../components/TileList/TileList';
import TileData from '../components/TileData/TileData';
import WorldTileData from '../components/WorldTileData/WorldTileData';

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
                <Grid item xs={9}>
                    <Map />
                </Grid>

                {/* side pane */}
                <Grid item xs={3}>
                    {this.props.worldTile._id && <WorldTileData />}
                    {this.props.tile.name && <TileData />}

                    <TileList />
                </Grid>
            </Grid>
        )
    }
}

export default connect(
    state => ({
        tile: state.tile,
        worldTile: state.worldTile
    }),
    dispatch => ({

    })
)(Home);