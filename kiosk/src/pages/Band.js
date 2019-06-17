import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { AppConsumer } from '../App';

export const bandQuery = gql`
    query bandQuery($eventId: String!, $bandId: String!) {
        band: getBand(eventId: $eventId, bandId: $bandId) {
            name
            bandId
            primaryImage(aspectRatio: "5x2", maxWidth: 1300) {
                url
            }
            artists: musicians {
                musicianId
                name
                description
                primaryImage(aspectRatio: "1x1", maxWidth: 200) {
                    url
                }
            }
        }
    }
`;

export default class Bands extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    linkToPage = (path) => () => {
        this.props.history.push(path);
    };

    renderBand(band) {
        const { name, bandId, primaryImage } = band;

        return (
            <div className="band-card" key={bandId} onClick={this.linkToPage(`/bands/${bandId}`)}>
                <img className="band-image" src={primaryImage.url} />
                <div className="band-name">{name}</div>
            </div>
        );

    }

    render() {
        const { bandId } = this.props.match.params;
        return (
            <div className="band-view navbar-spacer">
                <AppConsumer>
                    {(appState) => {
                        const { eventId } = appState;
                        return (
                            <Query query={bandQuery} variables={{ eventId, bandId }}>
                                {
                                    ({ loading, error, data }) => {
                                        if (loading) return 'Loading...';
                                        if (error) return `Error! ${error.message}`;
                                        return this.renderBand(data.band);
                                    }
                                }
                            </Query>
                        );
                    }}
                </AppConsumer>
            </div>
        );
    }
}
