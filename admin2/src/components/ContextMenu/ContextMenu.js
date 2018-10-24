import React from 'react';
import { connect } from 'react-redux'; 

import lively from '../../services/lively';
import crud from '../../services/crud';

import { addWorldTiles } from '../../actions';
import { Paper, IconButton } from '@material-ui/core';

import { Done } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    contextMenu: {
        position: 'absolute',
        padding: 10,
        opacity: 0,
        pointerEvents: 'none'
    },

    showContextMenu: {
        opacity: 1,
        pointerEvents: 'all'
    }
})

class ContextMenu extends React.Component {
    state = {}

    constructor(props) {
        super(props);
    }

    handleClick() {
        const { tile, mouseTarget, currentTool, pastMouseTargets } = this.props;
        const tilesToSave = [];

        if (!tile._id) return;

        var continued = 0;

        for (var x = 0; x < 24; x++) {
            for (var y = 0; y < 24; y++) {
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
                    );
                
                const entryInMouseTargetHistory = pastMouseTargets.find(target => target.x === x && target.y === y);

                if (currentTool === 'square' && !isSquare) continue;
                if (currentTool === 'squareFill' && !isSquareFill) continue;
                if (currentTool === 'brush' && !entryInMouseTargetHistory) continue;

                tilesToSave.push({
                    tileData: tile._id,
                    position: `${x},${y}`,
                    metadata: {},
        
                    items: [],
                    itemsBelowGround: [],
                    rotation: tile.rotation
                });
            }
        }

        crud.create('worldtiles', { worldTiles: tilesToSave })
            .then(newWorldTiles => {
                this.props.addWorldTiles(newWorldTiles);
            })
    }

    render() {
        const { classes, listeningForFinalTarget, mouseTarget } = this.props;
        const showContextMenu = !listeningForFinalTarget && mouseTarget[1].x >= 0 && mouseTarget[1].y >= 0;

        const style = {
            top: mouseTarget[1].y * 32 + 22,
            left: mouseTarget[1].x * 32 + 54
        };

        return (
            <Paper className={`${classes.contextMenu} ${showContextMenu && classes.showContextMenu}`} style={style}>
                <IconButton className={''} onClick={() => this.handleClick()}>
                    <Done />
                </IconButton>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        listeningForFinalTarget: state.listeningForFinalTarget,
        mouseTarget: state.mouseTarget,
        tile: state.tile,
        currentTool: state.currentTool,
        pastMouseTargets: state.pastMouseTargets
    }),

    dispatch => ({
        addWorldTiles: worldTiles => dispatch(addWorldTiles(worldTiles))
    })
)(withStyles(styles)(ContextMenu));