import React from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

})

class NpcsRoute extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Grid container spacing={40} justify="center">
                    {/* game */}
                    <Grid item xs={9}>

                    </Grid>

                    {/* side pane */}
                    <Grid item xs={3}>

                    </Grid>
                </Grid>
            </>
        )
    }
}

export default connect(
    state => ({
        tile: state.tile,
        worldTile: state.worldTile
    }),
    dispatch => ({

    })
)(withStyles(styles)(NpcsRoute));