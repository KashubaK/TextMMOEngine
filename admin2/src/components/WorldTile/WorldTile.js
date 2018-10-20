import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'

import { selectWorldTile } from '../../actions';

import lively from '../../services/lively';

const styles = theme => ({
    worldTile: {
        width: 32,
        height: 32,
        border: '1px solid #ddd',
        flexShrink: 0,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat"
    }
});

class WorldTile extends React.Component {
    constructor(props) {
        super(props);

        lively.registerEvent("SELECT_WORLDTILE", (state, action) => {
            state.worldTile = action.payload;

            return state;
        })
    }

    handleClick() {
        const { worldTile } = this.props;
        this.props.selectWorldTile(worldTile);
    }

    render() {
        const { classes, worldTile } = this.props;
        var styles = {};

        styles.transform = `rotate(${90 * worldTile.rotation}deg)`;
        
        if (worldTile.tileData.material === 'Grass') {
            styles.backgroundColor = "green";
        }

        if (worldTile.tileData.image) {
            styles.backgroundImage = "url(" + worldTile.tileData.image + ")";
        }

        return (
            <div className={classes.worldTile} style={styles} onClick={() => this.handleClick()}>
                <div dangerouslySetInnerHTML={ { __html: worldTile && worldTile.tileData.html } }></div>
            </div>
        )        
    }
}

export default connect(
    state => ({
        worldTiles: state.worldTiles
    }),

    dispatch => ({
        selectWorldTile: worldTile => dispatch(selectWorldTile(worldTile))
    })
)(withStyles(styles)(WorldTile))