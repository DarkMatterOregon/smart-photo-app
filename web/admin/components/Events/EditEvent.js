import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core';

import { AdminContext } from '../../Admin';
import { currentEventQuery } from '../../queries/events';
import ImageManager from '../ImageManager';

const styles = (theme) => ({
    formContainer: {
        padding: 20
    }
});

class EditEvent extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        name: ''
    };

    populateState = (data) => {
        const { event = {} } = data;
        this.setState({ name: event.name })
    };

    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    };

    renderEditEvent() {
        const { eventId } = this.props.match.params;
        const { classes } = this.props;

        return (
            <Query query={currentEventQuery} variables={{ eventId }} onCompleted={this.populateState}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <CircularProgress className={classes.progress} />;
                    }
                    if (error) {
                        return `Error!: ${error}`;
                    }
                    return this.renderEventForm(data.event);
                }}
            </Query>
        );
    }

    renderEventForm(event) {
        const { classes } = this.props;

        return (
            <Paper className={classes.formContainer}>
                <Typography variant="h6" gutterBottom>
                    Edit Event
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Event Name"
                            fullWidth
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                        />
                    </Grid>
                </Grid>
                <ImageManager sourceImageAlbums={event.sourceImageAlbums} />
            </Paper>
        )
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderEditEvent(context.currentEventId)}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(EditEvent);
