import React from 'react';
import { connect } from 'react-redux'; 

import lively from '../../services/lively';
import crud from '../../services/crud';

import { addTiles, updateTile, deleteTile, deleteWorldTile } from '../../actions';
import { Paper, TextField, Typography, Button, IconButton } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import WorldTile from '../WorldTile/WorldTile';

const styles = theme => ({
    root: {
        padding: theme.typography.pxToRem(20),
        marginBottom: theme.typography.pxToRem(20)
    },

    worldTile: {
        marginBottom: theme.typography.pxToRem(20),
        display: 'flex',
        justifyContent: 'center'
    },
    
    column: {
      flexBasis: '33.33%',
      flexShrink: 0
    },

    title: {
        marginBottom: theme.typography.pxToRem(20),
        textAlign: 'center'
    },

    heading: {
      fontSize: theme.typography.pxToRem(15),
    },

    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },

    textField: {
        width: '100%',
        marginBottom: theme.typography.pxToRem(15)
    },

    expansionPanelDetails: {
        flexWrap: 'wrap'
    },

    button: {
        marginRight: theme.typography.pxToRem(15)
    }
})

class TileData extends React.Component {
    constructor(props) {
        super(props);

        lively.registerEvent("UPDATE_TILE", (state, action) => {
            state.tile = {
                ...state.tile,
                ...action.payload
            }

            return state;
        })

        lively.registerEvent("DELETE_TILE", (state, action) => {
            state.tiles = state.tiles.filter(
                tile => tile._id !== action.payload
            );

            if (state.tile._id === action.payload) state.tile = {};

            return state;
        })
    }

    handleTileChange(property, e) {
        this.props.updateTile({
            [property]: e.target.value
        })
    }

    handleDelete() {
        crud.delete('tiles', this.props.tile._id)
            .then(() => {
                const worldTilesToDelete = this.props.worldTiles.filter(worldTile => worldTile.tileData._id === this.props.tile._id);
                const promises = [];

                worldTilesToDelete.forEach(worldTile => {
                    promises.push(
                        crud.delete('worldtiles', worldTile._id)
                    );
                })

                Promise.all(promises)
                    .then(() => {
                        worldTilesToDelete.forEach(worldTile => {
                            this.props.deleteWorldTile(worldTile._id);
                        });

                        this.props.deleteTile(this.props.tile._id)
                    })
            })
    }

    handleDuplicate() {
        crud.create('tiles', { tile: { ...this.props.tile, _id: undefined } } )
            .then(tile => this.props.addTiles([ tile ]))
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Typography variant="title" className={classes.title}>Tile to spawn: {this.props.tile.name}</Typography>

                <div className={classes.worldTile}>
                    <WorldTile worldTile={{ tileData: this.props.tile, rotation: this.props.tile.rotation }} />
                </div>
                
                <TextField
                    label="Rotation"
                    type="number"
                    className={classes.textField}
                    onChange={v => this.handleTileChange('rotation', v)}
                    value={this.props.tile.rotation}
                    helperText="The tile will be rotated by this value * 90 degrees"
                />

                <Button variant="outlined" color="primary" className={classes.button} onClick={() => this.handleDuplicate()}>
                    Duplicate
                </Button>

                <Button variant="outlined" color="secondary" className={classes.button} aria-label="Delete" onClick={() => this.handleDelete()}>
                    Delete
                </Button>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        worldTiles: state.worldTiles,
        tile: state.tile
    }),

    dispatch => ({
        updateTile: tile => dispatch(updateTile(tile)),
        deleteTile: tile => dispatch(deleteTile(tile)),
        addTiles: tile => dispatch(addTiles(tile)),

        deleteWorldTile: worldTile => dispatch(deleteWorldTile(worldTile))
    })
)(withStyles(styles)(TileData));