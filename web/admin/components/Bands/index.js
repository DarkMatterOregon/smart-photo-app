import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import Paper from '@material-ui/core/Paper';
import { Query } from 'react-apollo';
import { bandsByEventIdQuery } from '../../queries/bands';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AdminContext } from '../../Admin';

const styles = (theme) => ({
});

class Bands extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    renderBandsTable(bands) {
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
                name: 'bandId',
                label: 'Band ID'
            },
            {
                name: 'name',
                label: 'Name'
            }
        ];

        const options = {
            onRowClick: (row) => this.props.history.push(`/admin/bands/${row[1]}`)
        };

        return (
            <MUIDataTable
                title="Bands"
                data={bands}
                columns={columns}
                options={options}
            />
        );
    }

    renderBands(eventId) {
        const { classes } = this.props;

        if (!eventId) {
            return <h4>Select an Event</h4>;
        }

        return (
            <Query query={bandsByEventIdQuery} variables={{ eventId }}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <CircularProgress className={classes.progress} />;
                    }
                    if (error) {
                        return `Error!: ${error}`;
                    }
                    return (
                        <Paper className={classes.root}>
                            {this.renderBandsTable(data.bands)}
                        </Paper>
                    );
                }}
            </Query>
        );
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderBands(context.currentEventId)}
            </AdminContext.Consumer>
        );
    }
}

export default withRouter(
    withStyles(styles)(Bands)
);
