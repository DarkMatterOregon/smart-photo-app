import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { guardian } from 'Shared/AuthGuard';

class NavigationBar extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    onDoneVoting = () => {
        console.log('DONE');
        guardian.logout();
    };

    onBack = () => {
        this.props.history.goBack();
    };

    render() {
        return (
            <div className="navbar">
                <button onClick={this.onBack}>
                    <FontAwesomeIcon icon="chevron-left"/> Back
                </button>

                <button onClick={this.onDoneVoting}>
                    <FontAwesomeIcon icon="sign-out-alt" /> Done Voting
                </button>
            </div>
        );
    }
}

export default withRouter(NavigationBar);
