import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';

import { AdminContext } from '../../Admin';
import { bandQuery } from '../../queries/bands';
import ImageManager from '../ImageManager';

const styles = (theme) => ({
    formContainer: {
        padding: 20
    }
});

class EditBand extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        name: ''
    };

    populateState = (data) => {
        const { band = {} } = data;
        this.setState({ name: band.name })
    };

    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    };

    renderEditBand(eventId) {
        const { bandId } = this.props.match.params;
        const { classes } = this.props;

        if (eventId) {
            return (
                <Query query={bandQuery} variables={{ eventId, bandId }} onCompleted={this.populateState}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return <CircularProgress className={classes.progress}/>;
                        }
                        if (error) {
                            return `Error!: ${error}`;
                        }
                        return this.renderBandForm(data.band);
                    }}
                </Query>
            );
        }

        return <div>No Event</div>;
    }

    renderBandForm(band) {
        const { classes } = this.props;

        return (
            <Paper className={classes.formContainer}>
                <Typography variant="h6" gutterBottom>
                    Edit Band
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Band Name"
                            fullWidth
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                        />
                    </Grid>
                </Grid>
                <ImageManager sourceImageAlbums={band.sourceImageAlbums} />
            </Paper>
        )
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderEditBand(context.currentEventId)}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(EditBand);
