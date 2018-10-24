import React from 'react';
import { connect } from 'react-redux'; 

import lively from '../../services/lively';
import crud from '../../services/crud';

import { updateWorldTile, deleteWorldTile } from '../../actions';
import { Paper, TextField, Typography, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';

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

class WorldTileData extends React.Component {
    constructor(props) {
        super(props);

        lively.registerEvent("UPDATE_WORLDTILE", (state, action) => {
            state.worldTiles = state.worldTiles.map(
                worldTile => worldTile._id === action.payload._id ? action.payload : worldTile
            );

            if (state.worldTile._id === action.payload._id) state.worldTile = action.payload;

            return state;
        })

        lively.registerEvent("DELETE_WORLDTILE", (state, action) => {
            state.worldTiles = state.worldTiles.filter(
                worldTile => worldTile._id !== action.payload
            );

            if (state.worldTile._id === action.payload) state.worldTile = {};

            return state;
        })
    }

    handleTileChange(property, e) {
        crud.update('worldtiles', { worldTile: { ...this.props.worldTile, [property]: e.target.value } })
            .then(this.props.updateWorldTile)
    }

    handleDelete() {
        crud.delete('worldtiles', this.props.worldTile._id)
            .then(() => this.props.deleteWorldTile(this.props.worldTile._id))
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Typography variant="title" className={classes.title}>WorldTile: {this.props.worldTile.tileData.name}</Typography>

                <div className={classes.worldTile}>
                    <WorldTile worldTile={this.props.worldTile} />
                </div>
                
                <TextField
                    label="Rotation"
                    type="number"
                    className={classes.textField}
                    onChange={e => this.handleTileChange('rotation', e)}
                    value={this.props.worldTile.rotation}
                    helperText="The tile will be rotated by this value * 90 degrees"
                />

                <Button variant="outlined" color="secondary" className={classes.button} aria-label="Delete" onClick={() => this.handleDelete()}>
                    Delete
                </Button>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        worldTile: state.worldTile
    }),

    dispatch => ({
        updateWorldTile: tile => dispatch(updateWorldTile(tile)),
        deleteWorldTile: _id => dispatch(deleteWorldTile(_id))
    })
)(withStyles(styles)(WorldTileData));