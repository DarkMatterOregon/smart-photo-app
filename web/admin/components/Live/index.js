import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import { Mutation, Query } from 'react-apollo';
import { bandsByEventIdQuery } from '../../queries/bands';
import { setCurrentlyPlayingBandMutation } from '../../queries/realtime';
import { AdminContext } from '../../Admin';

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
    formContainer: {
        padding: 20
    },
    formRow: {
        paddingTop: 10,
        paddingBottom: 10
    },
    fullWidth: {
        width: '100%'
    }
});

class Live extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        scannedTicket: '',
        eventId: '',
        bandId: ''
    };

    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    };

    renderForm(bands, eventId) {
        const { classes } = this.props;
        const { bandId } = this.state;

        return (
            <Mutation mutation={setCurrentlyPlayingBandMutation}>
                {(setCurrentlyPlayingBandMutation, { data, loading }) => (
                    <Paper className={classes.formContainer}>
                        <Grid container>
                            <Grid item xs={12} className={classes.formRow}>
                                <Typography>Event Id: {eventId}</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.formRow}>
                                <FormControl className={classes.fullWidth}>
                                    <InputLabel htmlFor="band-select">Band</InputLabel>
                                    <Select
                                        value={this.state.bandId}
                                        onChange={this.handleChange('bandId')}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {bands.map(({ bandId, name }) => <MenuItem value={bandId} key={bandId}>{name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} className={classes.formRow}>
                                {loading && <CircularProgress className={classes.progress} />}
                            </Grid>
                            <Grid item xs={12} className={classes.formRow}>
                                <Button variant="outlined" color="primary" className={classes.button} onClick={() => {
                                    setCurrentlyPlayingBandMutation({ variables: { eventId, bandId } });
                                }}>
                                    Set Currently Playing Band
                                </Button>
                            </Grid>
                            <Grid item xs={12} className={classes.formRow}>
                                {data && <Typography>Current Band Id: {data.currentlyPlayingBand.value}</Typography>}
                            </Grid>
                        </Grid>
                    </Paper>
                )}
            </Mutation>
        );
    }


    render() {
        const { classes } = this.props;

        return (
            <AdminContext.Consumer>
                {({ currentEventId: eventId }) => {
                    return (
                        <Query query={bandsByEventIdQuery} variables={{ eventId }}>
                            {({ loading, error, data }) => {
                                if (loading) {
                                    return <CircularProgress className={classes.progress} />;
                                }

                                if (error) {
                                    return `Error!: ${error}`;
                                }

                                return this.renderForm(data.bands, eventId);
                            }}
                        </Query>
                    );
                }}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(Live);
