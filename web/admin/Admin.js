import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from './adminStyles';
import Header from './components/Header';
import NavDrawer from './components/NavDrawer';
import Content from './components/Content';
import Theme from './components/Theme';

export const AdminContext = React.createContext();

class Admin extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        open: true,
        currentEventId: '',
        currentEventName: '',
        setCurrentEvent: (eventId, eventName) => {
            this.setState({ currentEventId: eventId, currentEventName: eventName });
            localStorage.setItem('fanevent', JSON.stringify({ eventId, eventName }));
        }
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    componentDidMount() {
        const eventJson = localStorage.getItem('fanevent');
        if (eventJson) {
            const { eventId, eventName } = JSON.parse(eventJson);
            this.setState({ currentEventId: eventId, currentEventName: eventName });
        }
    }

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <AdminContext.Provider value={this.state}>
                <Theme>
                    <div className={classes.root}>
                        <Header classes={classes} handleDrawerOpen={this.handleDrawerOpen} open={open} />

                        <NavDrawer classes={classes} handleDrawerClose={this.handleDrawerClose} open={open} />

                        <Content classes={classes} />
                    </div>
                </Theme>
            </AdminContext.Provider>
        );
    }
}

export default withStyles(styles)(Admin);
