import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography } from '@material-ui/core'

import { addWorldTiles, addWorldTile } from '../../actions';

import crud from '../../services/crud';
import lively from '../../services/lively';

import WorldTile from '../WorldTile/WorldTile';

const styles = theme => ({
    map: {
        padding: theme.typography.pxToRem(20)
    },

    mapHeader: {
        fontSize: theme.typography.pxToRem(24)
    },

    worldMap: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        width: 792,
        height: 792,
        borderTop: '1px solid #ccc',
        borderLeft: '1px solid #ccc'
    },

    worldMapTileRow: {
        width: '100%',
        display: 'flex',
        borderBottom: '1px solid #ccc'
    }
});

class Map extends React.Component {
    constructor(props) {
        super(props);

        crud.findAll('worldtiles')
            .then(this.props.addWorldTiles);

        lively.registerEvent("ADD_WORLDTILES", (state, action) => {
            state.worldTiles = state.worldTiles.concat(action.payload);
        
            return state;
        });

        lively.registerEvent("ADD_WORLDTILE", (state, action) => {
            state.worldTiles.push(action.payload);
            state.worldTiles = Object.assign([], state.worldTiles);

            return state;
        })
    }

    render() {
        console.log("Map Rendered")
        const { classes } = this.props;

        const parsedWorldTiles = [];
        
        this.props.worldTiles.forEach(worldTile => {
            if (!worldTile.position) return;

            const coords = worldTile.position.split(',');

            const x = coords[0];
            const y = coords[1];

            if (!parsedWorldTiles[y]) parsedWorldTiles[y] = [];

            parsedWorldTiles[y][x] = worldTile;
        });

        for (var i = 0; i < 24; i++) {
            if (!parsedWorldTiles[i]) parsedWorldTiles[i] = [];
            
            for (var o = 0; o < 24; o++) {
                if (!parsedWorldTiles[i][o]) parsedWorldTiles[i][o] = null;
            }
        }

        return (
            <Paper className={classes.map}>
                <Typography className={classes.mapHeader}>
                    Map
                </Typography>

                <div className={classes.worldMap}>
                    {parsedWorldTiles.map((worldTileRow, y) => (
                        <div className={classes.worldMapTileRow}>
                            {worldTileRow.map((worldTile, x) => 
                                <WorldTile x={x} y={y} worldTile={worldTile} />
                            )}
                        </div>
                    ))}
                </div>
            </Paper>
        )        
    }
}

export default connect(
    state => ({
        tile: state.tile,
        worldTiles: state.worldTiles
    }),
    dispatch => ({
        addWorldTiles: worldTiles => dispatch(addWorldTiles(worldTiles))
    })
)(withStyles(styles)(Map))