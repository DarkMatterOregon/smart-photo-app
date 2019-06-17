import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

const defaultFailedComponent = ({ role }) => (
    <div>
        <h3>Unauthorized</h3>
        <p>Must have [{role}] role to view this page</p>
    </div>
);

export default function (role, ComposedComponent, FailedComponent = defaultFailedComponent) {
    class RoleChecker extends Component {
        render() {
            const { loggedIn, roles = [] } = this.props;

            if (loggedIn && (_.isEmpty(role) || role === 'none' || roles.includes(role) || roles.includes('admin'))) {
                return <ComposedComponent {...this.props} />;
            }

            return <FailedComponent role={role} />;
        }
    }

    const mapStateToProps = (state) => (
        {
            roles: _.get(state, 'auth.roles', []),
            loggedIn: _.get(state, 'auth.loggedIn', false)
        }
    );

    return connect(mapStateToProps)(RoleChecker);
}
