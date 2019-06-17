import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Loading extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    render() {
        return (
            <div className="loading-view">
                <div className="loading-text">
                    Loading ...
                </div>
            </div>
        );
    }
}
