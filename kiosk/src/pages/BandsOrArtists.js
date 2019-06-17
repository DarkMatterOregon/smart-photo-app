import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class BandsOrArtists extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    linkToPage = (path) => () => {
        this.props.history.push(path);
    };

    render() {
        return (
            <div className="bands-or-artists">
                <div className="bands-button" onClick={this.linkToPage('/bands')}>
                    <div>Bands</div>
                </div>
                <div className="artists-button" onClick={this.linkToPage('/artists')}>
                    <div>Artists</div>
                </div>
            </div>
        );
    }
}

export default withRouter(BandsOrArtists);
