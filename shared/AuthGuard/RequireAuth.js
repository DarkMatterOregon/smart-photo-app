import React, { Component } from 'react';
import { guardian } from './index';

export default function (ComposedComponent, FailedComponent) {
    class Authentication extends Component {
        state = {
            isLoggedIn: guardian.isLoggedIn()
        };

        componentDidMount() {
            this.state = {
                isLoggedIn: guardian.isLoggedIn()
            };

            guardian.on('updatedToken', () => {
                this.setState({ isLoggedIn: guardian.isLoggedIn() })
            });
        }

        renderFailedAuth() {
            if (FailedComponent) {
                return <FailedComponent {...this.props} />;
            }

            return null;
        }

        render() {
            if (!this.state.isLoggedIn) {
                return this.renderFailedAuth();
            }
            return <ComposedComponent {...this.props} />;
        }
    }

    return Authentication;
}
