import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronLeft);
library.add(faSignOutAlt);

import Scan from './pages/Scan';
import BandsOrArtists from './pages/BandsOrArtists';
import Bands from './pages/Bands';
import Band from './pages/Band';
import Artists from './pages/Artists';

import NavigationBar from './components/NavigationBar';

import './main.scss';
import RequireAuth from '../../shared/AuthGuard/RequireAuth';


const AppContext = React.createContext({});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default class App extends Component {
    state = {
        eventId: ''
    };

    changeEventId = (eventId) => {
        this.setState({ eventId });
    };

    render() {
        return (
            <AppProvider value={{ appState: this.state, changeEventId: this.changeEventId }}>
                <div className="app-contents">
                    <NavigationBar />
                    <Switch>
                        <Route path="/bands/:bandId" component={RequireAuth(Band, Scan)} />
                        <Route path="/bands" component={RequireAuth(Bands, Scan)} />

                        <Route path="/artists" component={RequireAuth(Artists, Scan)} />

                        <Route path="/home" component={RequireAuth(BandsOrArtists, Scan)} />

                        <Route path="*" component={Scan} />
                    </Switch>
                </div>
            </AppProvider>
        );
    }
}
