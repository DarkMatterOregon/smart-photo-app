import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import DashboardIcon from '@material-ui/icons/Dashboard';
import EventIcon from '@material-ui/icons/Event';
import BandIcon from '@material-ui/icons/Group';
import MusicianIcon from '@material-ui/icons/Person';
import LiveIcon from '@material-ui/icons/LiveTv';
import BallotIcon from '@material-ui/icons/Ballot';
import BarChartIcon from '@material-ui/icons/BarChart';


export const mainListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button component={Link} to="/admin/events">
            <ListItemIcon>
                <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
        </ListItem>

        <ListItem button component={Link} to="/admin/bands">
            <ListItemIcon>
                <BandIcon />
            </ListItemIcon>
            <ListItemText primary="Bands" />
        </ListItem>

        <ListItem button component={Link} to="/admin/musicians">
            <ListItemIcon>
                <MusicianIcon />
            </ListItemIcon>
            <ListItemText primary="Musicians" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Live</ListSubheader>
        <ListItem button component={Link} to="/admin/live-update">
            <ListItemIcon>
                <LiveIcon />
            </ListItemIcon>
            <ListItemText primary="Live Update" />
        </ListItem>
        <ListItem button component={Link} to="/admin/reports">
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button component={Link} to="/admin/generate-ballot">
            <ListItemIcon>
                <BallotIcon />
            </ListItemIcon>
            <ListItemText primary="Generate Ballot" />
        </ListItem>
    </div>
);
