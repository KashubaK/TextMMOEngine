import React from 'react';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles'

import { addWorldTiles, selectWorldTile, setMousePosition, setInitialMouseTarget, setFinalMouseTarget, setListeningForFinalTarget } from '../../actions';
import crud from '../../services/crud';

const styles = theme => ({
    worldTile: {
        width: 32,
        height: 32,
        border: '1px solid #ddd',
        flexShrink: 0
    },

    inContext: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid #aaa'
    },

    tileImage: {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.5
    }
});

class BlankWorldTile extends React.Component {
    handleMouseOver() {
        const { x, y, listeningForFinalTarget } = this.props;

        this.props.setMousePosition({ x, y });

        if (listeningForFinalTarget) {
            this.props.setFinalMouseTarget({ x, y })
        }
    }

    handleMouseDown() {
        const { x, y } = this.props;

        this.props.setInitialMouseTarget({ x, y })
        this.props.setListeningForFinalTarget(true)
    }

    handleMouseUp() {
        this.props.setListeningForFinalTarget(false);
    }


    render() {
        const { classes, mousePosition, mouseTarget, currentTool, pastMouseTargets, tile, x, y } = this.props;
        const entryInMouseTargetHistory = pastMouseTargets.find(target => target.x === x && target.y === y);

        const isSquareFill = 
            (
                x >= mouseTarget[0].x && x <= mouseTarget[1].x &&
                y >= mouseTarget[0].y && y <= mouseTarget[1].y
            ) ||
            (
                x <= mouseTarget[0].x && x >= mouseTarget[1].x &&
                y <= mouseTarget[0].y && y >= mouseTarget[1].y
            ) ||
            (
                x >= mouseTarget[0].x && x <= mouseTarget[1].x &&
                y <= mouseTarget[0].y && y >= mouseTarget[1].y
            ) ||
            (
                x <= mouseTarget[0].x && x >= mouseTarget[1].x &&
                y >= mouseTarget[0].y && y <= mouseTarget[1].y
            );

        const isSquare = 
            (
                (x >= mouseTarget[0].x && y === mouseTarget[0].y && x <= mouseTarget[1].x) ||
                (x >= mouseTarget[0].x && y === mouseTarget[1].y && x <= mouseTarget[1].x) ||

                (y >= mouseTarget[0].y && x === mouseTarget[1].x && y <= mouseTarget[1].y) ||
                (y >= mouseTarget[0].y && x === mouseTarget[0].x && y <= mouseTarget[1].y)
            ) ||
            (
                (x <= mouseTarget[0].x && y === mouseTarget[0].y && x >= mouseTarget[1].x) ||
                (x <= mouseTarget[0].x && y === mouseTarget[1].y && x >= mouseTarget[1].x) ||

                (y <= mouseTarget[0].y && x === mouseTarget[1].x && y >= mouseTarget[1].y) ||
                (y <= mouseTarget[0].y && x === mouseTarget[0].x && y >= mouseTarget[1].y)
            )

        const inContext = 
            (
                currentTool === 'squareFill' && isSquareFill &&
                mouseTarget[1].x > 0 && mouseTarget[1].y > 0 
            ) ||
            (
                currentTool === 'square' &&
                isSquare &&
                mouseTarget[1].x > 0 && mouseTarget[1].y > 0 
            ) ||
            (
                currentTool === 'brush' &&
                entryInMouseTargetHistory
            ) ||
            (
                mousePosition.x === x && mousePosition.y === y
            );

        var styles = {};

        if (tile.image) {
            styles.backgroundImage = "url(" + tile.image + ")";
        }

        return (
            <div 
                className={`${classes.worldTile} ${inContext ? classes.inContext : ''}`}
                onMouseOver={() => this.handleMouseOver()}
                onMouseDown={() => this.handleMouseDown()}
                onMouseUp={() => this.handleMouseUp()}
            >
                {inContext && <div className={classes.tileImage} style={styles}></div>}
            </div>
        )        
    }
}

export default connect(
    state => ({
        tile: state.tile,
        currentTool: state.currentTool,
        mousePosition: state.mousePosition,
        mouseTarget: state.mouseTarget,
        listeningForFinalTarget: state.listeningForFinalTarget,
        pastMouseTargets: state.pastMouseTargets
    }),

    dispatch => ({
        addWorldTiles: worldTile => dispatch(addWorldTiles(worldTile)),
        selectWorldTile: worldTile => dispatch(selectWorldTile(worldTile)),

        setMousePosition: coords => dispatch(setMousePosition(coords)),
        setInitialMouseTarget: coords => dispatch(setInitialMouseTarget(coords)),
        setFinalMouseTarget: coords => dispatch(setFinalMouseTarget(coords)),
        setListeningForFinalTarget: coords => dispatch(setListeningForFinalTarget(coords))
    })
)(withStyles(styles)(BlankWorldTile))