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
import { musicianQuery } from '../../queries/musicians';
import ImageManager from '../ImageManager';

const styles = (theme) => ({
    formContainer: {
        padding: 20
    }
});

class EditMusician extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        name: ''
    };

    populateState = (data) => {
        const { musician = {} } = data;
        this.setState({ name: musician.name })
    };

    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    };

    renderEditMusician(eventId) {
        const { musicianId } = this.props.match.params;
        const { classes } = this.props;

        return (
            <Query query={musicianQuery} variables={{ eventId, musicianId }} onCompleted={this.populateState}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <CircularProgress className={classes.progress} />;
                    }
                    if (error) {
                        return `Error!: ${error}`;
                    }
                    return this.renderMusicianForm(data.musician);
                }}
            </Query>
        );
    }

    renderMusicianForm(musician) {
        const { classes } = this.props;

        return (
            <Paper className={classes.formContainer}>
                <Typography variant="h6" gutterBottom>
                    Edit Musician
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Musician Name"
                            fullWidth
                            value={this.state.name}
                            onChange={this.handleChange('name')}
                        />
                    </Grid>
                </Grid>
                <ImageManager sourceImageAlbums={musician.sourceImageAlbums} />
            </Paper>
        )
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderEditMusician(context.currentEventId)}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(EditMusician);
