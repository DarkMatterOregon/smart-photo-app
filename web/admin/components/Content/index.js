import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import Events from '../Events';
import EditEvent from '../Events/EditEvent';
import Bands from '../Bands';
import Musicians from '../Musicians';
import EditMusician from '../Musicians/EditMusician';
import GenerateBallot from '../EventBallots/GenerateBallot';
import Live from '../Live';
import Reports from '../Reports';

import './content.scss';
import EditBand from '../Bands/EditBand';

export default class Content extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Switch>
                    <Route path="/admin/dashboard" name="Fanosity Dashboard" component={() => <div>Dashboard</div>} />
                    <Route path="/admin/events/:eventId" name="Fanosity Events" component={EditEvent} />
                    <Route path="/admin/events" name="Fanosity Events" component={Events} />

                    <Route path="/admin/bands/:bandId" name="Edit Band" component={EditBand} />
                    <Route path="/admin/bands" name="Fanosity Bands" component={Bands} />

                    <Route path="/admin/musicians/:musicianId" name="Edit Musician" component={EditMusician} />
                    <Route path="/admin/musicians" name="Fanosity Musicians" component={Musicians} />

                    <Route path="/admin/generate-ballot" name="Generate Ballot" component={GenerateBallot} />

                    <Route path="/admin/live-update" name="Update Live Data" component={Live} />
                    <Route path="/admin/reports" name="Reports" component={Reports} />
                </Switch>
            </main>
        );
    }
}
