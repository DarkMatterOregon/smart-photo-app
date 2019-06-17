import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import { Query } from 'react-apollo';
import { musiciansByEventIdQuery } from '../../queries/musicians';

import { AdminContext } from '../../Admin';

const styles = (theme) => ({
});

class Musicians extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    renderMusiciansTable(musicians) {
        const columns = [
            {
                label: ' ',
                name: 'primaryImage',
                options: {
                    customBodyRender: (value) => {
                        if (value.url) {
                            return <img src={value.url}/>;
                        }
                        return <div>No Image</div>;
                    }
                }
            },
            {
                name: 'musicianId',
                label: 'Musician ID'
            },
            {
                name: 'firstName',
                label: 'First Name'
            },
            {
                name: 'lastName',
                label: 'Last Name'
            },
            {
                name: 'description',
                label: 'Description'
            }
        ];

        const options = {
            onRowClick: (row) => this.props.history.push(`/admin/musicians/${row[1]}`),
            rowsPerPage: 100
        };

        return (
            <MUIDataTable
                title="Musicians"
                data={musicians}
                columns={columns}
                options={options}
            />
        );
    }

    renderMusicians(eventId) {
        const { classes } = this.props;

        if (!eventId) {
            return <h4>Select an Event</h4>;
        }

        return (
            <Query query={musiciansByEventIdQuery} variables={{ eventId }}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <CircularProgress className={classes.progress} />;
                    }
                    if (error) {
                        return `Error!: ${error}`;
                    }
                    return (
                        <Paper className={classes.root}>
                            {this.renderMusiciansTable(data.musicians)}
                        </Paper>
                    );
                }}
            </Query>
        );
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderMusicians(context.currentEventId)}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(Musicians);
