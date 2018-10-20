import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'

import { addWorldTile, selectWorldTile } from '../../actions';
import crud from '../../services/crud';

const styles = theme => ({
    worldTile: {
        width: 32,
        height: 32,
        border: '1px solid #ddd',
        flexShrink: 0
    }
});

class BlankWorldTile extends React.Component {
    handleClick() {
        const { tile, x, y } = this.props;

        if (tile._id) {
            this.spawnWorldTile(tile, x, y);
        }
    }

    spawnWorldTile() {
        const { tile, x, y } = this.props;

        const worldTile = {
            tileData: tile._id,
            position: `${x},${y}`,
            metadata: {},

            items: [],
            itemsBelowGround: [],
            rotation: tile.rotation
        };

        crud.create('worldtiles', { worldTile })
            .then(newWorldTile => {
                this.props.addWorldTile(newWorldTile);
                this.props.selectWorldTile(newWorldTile);
            })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.worldTile} onClick={() => this.handleClick()}></div>
        )        
    }
}

export default connect(
    state => ({
        tile: state.tile
    }),

    dispatch => ({
        addWorldTile: worldTile => dispatch(addWorldTile(worldTile)),
        selectWorldTile: worldTile => dispatch(selectWorldTile(worldTile))
    })
)(withStyles(styles)(BlankWorldTile))