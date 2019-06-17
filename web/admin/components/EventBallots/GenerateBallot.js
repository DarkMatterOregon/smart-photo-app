import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { axios } from 'Shared/AuthGuard';
import { LOCAL_BOOTH_CONTROL_API, FANOSITY_AUTH_URL } from 'Shared/config/apiEndpoints';

const styles = (theme) => ({
    formContainer: {
        padding: 20
    }
});

class GenerateBallot extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {
        scannedTicket: '',
        eventId: 'event_2019_eugene-make-a-band'
    };

    handleChange = (name) => (e) => {
        this.setState({ [name]: e.target.value });
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const { scannedTicket, eventId } = this.state;
            const createBallotUrl = `${FANOSITY_AUTH_URL}/eventballot`;
            const createBallotParams = {
                eventId,
                ticketNumber: scannedTicket,
                ticketType: 'TICKETS_WEST'
            };

            axios.post(createBallotUrl, createBallotParams)
                .then(({ data }) => _.get(data, 'data.profileCode', ''))
                .then((ballotCode) => {
                    const printBallotUrl = `${LOCAL_BOOTH_CONTROL_API}/print-ballot`;
                    return axios.post(printBallotUrl, { ballotCode });
                })
                .then(({ data }) => {
                    this.setState({ scannedTicket: '' });
                });
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.formContainer}>
                <TextField
                    required
                    id="eventId"
                    name="eventId"
                    label="Event Id"
                    fullWidth
                    value={this.state.eventId}
                    onChange={this.handleChange('eventId')}
                    onKeyDown={this.handleKeyDown}
                />
                <TextField
                    required
                    id="scannedTicket"
                    name="scannedTicket"
                    label="Scanned Ticket"
                    fullWidth
                    value={this.state.scannedTicket}
                    onChange={this.handleChange('scannedTicket')}
                    onKeyDown={this.handleKeyDown}
                    autoFocus
                />
            </Paper>
        );
    }
}

export default withStyles(styles)(GenerateBallot);
