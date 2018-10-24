import React from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';

import TileList from '../components/TileList/TileList';
import TileData from '../components/TileData/TileData';
import WorldTileData from '../components/WorldTileData/WorldTileData';
import ToolKit from '../components/ToolKit/ToolKit';

import Map from '../components/Map/Map';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    toolKit: {
        flexBasis: '48px'
    }
})

class MapRoute extends React.Component {
    constructor(props) {
        super(props);
    }
    
    handleChange(v) {
        console.log(v)
    }

    render() {
        const { classes } = this.props;
        
        return (
            <Grid container spacing={40} justify="center">
                {/* toolkit */}
                <Grid item xs={1} className={classes.toolKit}>
                    <ToolKit />
                </Grid>

                {/* game */}
                <Grid item xs={8}>
                    <Map />
                </Grid>

                {/* side pane */}
                <Grid item xs={3}>
                    {this.props.worldTile._id && <WorldTileData />}
                    {this.props.tile.name && <TileData />}

                    <TileList />
                </Grid>
            </Grid>
        );
    }
}

export default connect(
    state => ({
        tile: state.tile,
        worldTile: state.worldTile
    }),
    dispatch => ({

    })
)(withStyles(styles)(MapRoute));