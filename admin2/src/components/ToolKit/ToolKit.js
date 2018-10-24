import React from 'react';
import { connect } from 'react-redux'; 

import lively from '../../services/lively';
import crud from '../../services/crud';

import { selectTool } from '../../actions';
import { Paper, IconButton } from '@material-ui/core';

import { CropSquare, Create, Backspace, SelectAll, AddCircle, Brush, OpenWith } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
    toolKitOptions: {
        padding: 10
    },

    activeButton: {
        backgroundColor: grey[500],
        color: 'white'
    }
})

class ToolKit extends React.Component {
    state = { 

    }

    constructor(props) {
        super(props);

        lively.registerEvent("SELECT_TOOL", (state, action) => {
            state.currentTool = action.payload;
            state.mouseTarget = [{ x: -1, y: -1 }, { x: -1, y: -1 }];
            state.listeningForFinalTarget = false;

            return state;
        });
    }

    handleClick(tool) {
        this.props.selectTool(tool);
    }

    render() {
        const { classes, currentTool } = this.props;

        return (
            <Paper className={classes.toolKitOptions}>
                <IconButton className={currentTool === 'select' ? classes.activeButton : ''} onClick={() => this.handleClick('select')}>
                    <OpenWith />
                </IconButton>

                <IconButton className={currentTool === 'pencil' ? classes.activeButton : ''} onClick={() => this.handleClick('pencil')}>
                    <Create />
                </IconButton>

                <IconButton className={currentTool === 'brush' ? classes.activeButton : ''} onClick={() => this.handleClick('brush')}>
                    <Brush />
                </IconButton>

                <IconButton className={currentTool === 'square' ? classes.activeButton : ''} onClick={() => this.handleClick('square')}>
                    <CropSquare />
                </IconButton>

                <IconButton className={currentTool === 'squareFill' ? classes.activeButton : ''} onClick={() => this.handleClick('squareFill')}>
                    <SelectAll />
                </IconButton>

                <IconButton className={currentTool === 'delete' ? classes.activeButton : ''} onClick={() => this.handleClick('delete')}>
                    <Backspace />
                </IconButton>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        currentTool: state.currentTool
    }),

    dispatch => ({
        selectTool: tool => dispatch(selectTool(tool))
    })
)(withStyles(styles)(ToolKit));