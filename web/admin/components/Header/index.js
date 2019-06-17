import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar/index';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar/index';
import IconButton from '@material-ui/core/IconButton/index';
import Typography from '@material-ui/core/Typography/index';
import Badge from '@material-ui/core/Badge/index';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import logoutMutation from '../../mutations/logout';
import { graphql } from 'react-apollo/index';
import { guardian } from 'Shared/AuthGuard';
import { AdminContext } from '../../Admin';

class Index extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        handleDrawerOpen: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired
    };

    logout = () => {
        guardian.logout();
    };

    renderHeader(currentEventName) {
        const { classes, handleDrawerOpen, open } = this.props;

        return (
            <AppBar
                position="absolute"
                className={classNames(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar disableGutters={!open} className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        className={classNames(
                            classes.menuButton,
                            open && classes.menuButtonHidden,
                        )}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h5"
                        color="inherit"
                        noWrap
                    >
                        Fanosity System Administration
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        Current Event: {currentEventName}
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={this.logout}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        );
    }

    render() {
        return (
            <AdminContext.Consumer>
                {({ currentEventName }) => this.renderHeader(currentEventName)}
            </AdminContext.Consumer>
        );
    }
}

export default graphql(logoutMutation)(
    Index
);
