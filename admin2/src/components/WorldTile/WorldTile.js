import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import { addWorldTile } from '../../actions';

import crud from '../../services/crud';

const styles = theme => ({
    worldTile: {
        width: 32,
        height: 32,
        borderRight: '1px solid #ddd',
        flexShrink: 0
    }
});

class WorldTile extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        const { worldTile, tile, x, y } = this.props;

        if (!worldTile && tile._id) this.spawnWorldTile(tile, x, y);
    }

    spawnWorldTile() {
        const { tile, x, y } = this.props;

        const worldTile = {
            tileData: tile._id,
            position: `${x},${y}`,
            metadata: {},

            items: [],
            itemsBelowGround: []
        };

        crud.create('worldtiles', { worldTile })
            .then(this.props.addWorldTile)
    }

    render() {
        const { classes, worldTile } = this.props;
        var styles = {};

        if (worldTile) console.log(worldTile)

        if (worldTile) {
            if (worldTile.tileData.material === 'Grass') {
                styles.backgroundColor = "green";
            }
        }

        return (
            <div className={classes.worldTile} style={styles} onClick={() => this.handleClick()}>

            </div>
        )        
    }
}

export default connect(
    state => ({
        worldTiles: state.worldTiles,
        tile: state.tile
    }),

    dispatch => ({
        addWorldTile: worldTile => dispatch(addWorldTile(worldTile))
    })
)(withStyles(styles)(WorldTile))