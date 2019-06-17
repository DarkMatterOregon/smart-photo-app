import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import { Query } from 'react-apollo';
import { currentEventsQuery } from '../../queries/events';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AdminContext } from '../../Admin';

const styles = (theme) => ({
});

class Events extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    renderEventsTable(events, setCurrentEvent) {
        const columns = [
            {
                name: 'eventId',
                label: 'Event ID'
            },
            {
                name: 'name',
                label: 'Name'
            },
            {
                name: 'eventType',
                label: 'Event Type'
            }
        ];

        const options = {
            onRowClick: (row) => {
                setCurrentEvent(row[0], row[1]);
                this.props.history.push(`/admin/events/${row[0]}`);
            }
        };

        return (
            <MUIDataTable
                title="Events"
                data={events}
                columns={columns}
                options={options}
            />
        );
    }

    renderEvents(eventId, setCurrentEvent) {
        const { classes } = this.props;
        return (
            <Query query={currentEventsQuery}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <CircularProgress className={classes.progress} />;
                    }
                    if (error) {
                        return `Error!: ${error}`;
                    }
                    return (
                        <Paper className={classes.root}>
                            {this.renderEventsTable(data.events, setCurrentEvent)}
                        </Paper>
                    );
                }}
            </Query>
        )
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderEvents(context.currentEventId, context.setCurrentEvent)}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(Events);
