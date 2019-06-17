import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton/index';
import Divider from '@material-ui/core/Divider/index';
import List from '@material-ui/core/List/index';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Drawer from '@material-ui/core/Drawer/index';
import { mainListItems, secondaryListItems } from './listItems';

export default class NavDrawer extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        handleDrawerClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired
    };


    render() {
        const { classes, handleDrawerClose, open } = this.props;

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Divider />
                <List>{secondaryListItems}</List>
            </Drawer>
        );
    }
}
