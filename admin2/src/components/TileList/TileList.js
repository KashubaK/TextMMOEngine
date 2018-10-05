import React from 'react';
import { connect } from 'react-redux'; 

import lively from '../../services/lively';
import crud from '../../services/crud';

import { addTiles, selectTile } from '../../actions';
import { Paper, ExpansionPanel, ExpansionPanelSummary, Button, TextField, MenuItem, Typography, ExpansionPanelDetails, Input } from '@material-ui/core';

import { AddCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: 480,
        padding: 20
    },
    
    column: {
      flexBasis: '33.33%',
      flexShrink: 0
    },

    title: {
        marginBottom: theme.typography.pxToRem(20)
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
        marginBottom: 15
    },

    expansionPanelDetails: {
        flexWrap: 'wrap'
    }
})

class TileList extends React.Component {
    state = { 
        tile: {
            name: 'Grass',
            material: 'Grass',
            type: 'Ground',
            energyCost: 1,
            traversable: 'Yes'
        } 
    }

    constructor(props) {
        super(props);

        crud.findAll('tiles')
            .then(this.props.addTiles);

        lively.registerEvent("ADD_TILES", (state, action) => {
            state.tiles = state.tiles.concat(action.payload);

            return state;
        })

        lively.registerEvent("SELECT_TILE", (state, action) => {
            state.tile = action.payload;

            return state;
        })
    }

    handleTileChange(property, e) {
        this.setState({
            tile: {
                ...this.state.tile,

                [property]: e.target.value
            }
        })
    }

    createTile() {
        crud.create('tiles', { tile: this.state.tile })
            .then(this.props.addTile)
    }

    handleClick(tile) {
        this.props.selectTile(tile)
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Typography variant="title" className={classes.title}>Tiles</Typography>
                
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        <div className={classes.column}>
                            <Typography className={classes.heading}>
                                New Tile
                            </Typography>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                        <TextField
                            label="Name" 
                            className={classes.textField}
                            onChange={v => this.handleTileChange('name', v)}
                            value={this.state.tile.name}
                            helperText="Keep it recognizable and common"
                        />

                        <TextField
                            label="Material"
                            className={classes.textField}
                            onChange={v => this.handleTileChange('material', v)}
                            value={this.state.tile.material}
                            helperText="What is the tile made of?"
                        />

                        <TextField
                            label="Type"
                            className={classes.textField}
                            onChange={v => this.handleTileChange('type', v)}
                            value={this.state.tile.type}
                            helperText="Where is the tile placed?"
                        />

                        <TextField
                            label="Energy Cost"
                            type="number"
                            className={classes.textField}
                            onChange={v => this.handleTileChange('energyCost', v)}
                            value={this.state.tile.energyCost}
                            helperText="How much stamina will it take to traverse over?"
                        />

                        <TextField
                            label="Traversable"
                            select
                            className={classes.textField}
                            onChange={v => this.handleTileChange('traversable', v)}
                            value={this.state.tile.traversable}
                            helperText="Can we even walk over it?">

                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </TextField>
                        
                        <Button variant="contained" color="primary" className={classes.button} onClick={() => this.createTile()}>
                            Save
                        </Button>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <br/>
                 
                {this.props.tiles.map(tile => 
                    <ExpansionPanel onClick={() => this.handleClick(tile)}>
                        <ExpansionPanelSummary>
                            <div className={classes.column}>
                                <Typography className={classes.heading}>
                                    {tile.name}
                                </Typography>
                            </div>
                            <div className={classes.column}>
                                <Typography className={classes.secondaryHeading}>
                                    {tile.material}
                                </Typography>
                            </div>
                        </ExpansionPanelSummary>
                    </ExpansionPanel>
                )}
            </Paper>
        )
    }
}

export default connect(
    state => ({
        tiles: state.tiles,
        tile: state.tile
    }),

    dispatch => ({
        addTiles: tiles => dispatch(addTiles(tiles)),
        selectTile: tile => dispatch(selectTile(tile))
    })
)(withStyles(styles)(TileList));