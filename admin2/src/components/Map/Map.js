import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography } from '@material-ui/core'

import { addWorldTiles } from '../../actions';

import crud from '../../services/crud';
import lively from '../../services/lively';

import WorldTile from '../WorldTile/WorldTile';
import BlankWorldTile from '../BlankWorldTile/BlankWorldTile';
import ContextMenu from '../ContextMenu/ContextMenu';

const styles = theme => ({
    map: {
        padding: theme.typography.pxToRem(20),
        position: 'relative'
    },

    mapHeader: {
        fontSize: theme.typography.pxToRem(24)
    },

    worldMap: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        width: 816,
        height: 816,
        border: '1px solid #ddd'
    },

    worldMapTileRow: {
        width: '100%',
        display: 'flex'
    }
});

class Map extends React.Component {
    constructor(props) {
        super(props);

        crud.findAll('worldtiles')
            .then(this.props.addWorldTiles);

        lively.registerEvent("ADD_WORLDTILES", (state, action) => {
            state.worldTiles = [...state.worldTiles, ...action.payload];
        
            return state;
        });

        lively.registerEvent("ADD_WORLDTILE", (state, action) => {
            state.worldTiles = [...state.worldTiles, action.payload];

            return state;
        })

        lively.registerEvent("SET_MOUSE_POSITION", (state, action) => {
            state.mousePosition = action.payload;

            return state;
        });

        lively.registerEvent("SET_INITIAL_MOUSE_TARGET", (state, action) => {
            state.mouseTarget[0] = action.payload;
            state.mouseTarget[1] = { x: -1, y: -1 };
            state.pastMouseTargets = [];

            return state;
        });

        lively.registerEvent("SET_LISTENING_FOR_FINAL_TARGET", (state, action) => {
            state.listeningForFinalTarget = action.payload; // true || false

            return state;
        })

        lively.registerEvent("SET_FINAL_MOUSE_TARGET", (state, action) => {
            state.mouseTarget[1] = action.payload;
            state.pastMouseTargets = [...state.pastMouseTargets, action.payload];

            return state;
        });
    }

    render() {
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
                <ContextMenu />

                <div className={classes.worldMap}>
                    {parsedWorldTiles.map((worldTileRow, y) => 
                        <div className={classes.worldMapTileRow}>
                            {worldTileRow.map((worldTile, x) => 
                                <>
                                    {worldTile && <WorldTile worldTile={worldTile} />}

                                    {!worldTile && <BlankWorldTile x={x} y={y} />}
                                </>
                            )}
                        </div>
                    )}
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