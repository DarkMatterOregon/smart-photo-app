import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RequireAuth from 'Shared/AuthGuard/RequireAuth';

import Home from './publicSite/Home';
import Admin from './admin/Admin';
import Login from './admin/Login';
import PrivacyPolicy from './publicSite/PrivacyPolicy';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        path="/admin"
                        name="Admin"
                        component={RequireAuth(Admin, Login)}
                    />
                    <Route
                        path="/privacy"
                        name="PrivacyPolicy"
                        component={PrivacyPolicy}
                    />
                    <Route
                        path="*"
                        name="Home"
                        component={Home}
                        exact
                    />
                </Switch>
            </Router>
        );
    }
}

export default App;

