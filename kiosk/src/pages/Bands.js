import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { AppConsumer } from '../App';
import Loading from '../components/Loading';

export const bandsQuery = gql`
    query bandsQuery($eventId: String!) {
        bands: getBandsByEvent(eventId: $eventId) {
            name
            bandId
            primaryImage(aspectRatio: "5x2", maxWidth: 1300) {
                url
            }
            artists: musicians {
                description
                name
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

    renderBandRow(band) {
        const { name, bandId, primaryImage } = band;

        return (
            <div className="band-card" key={bandId} onClick={this.linkToPage(`/bands/${bandId}`)}>
                <img className="band-image" src={primaryImage.url} />
                <div className="band-name">{name}</div>
            </div>
        );

    }

    render() {
        return (
            <div className="bands-view navbar-spacer">
                <AppConsumer>
                    {(appState) => {
                        const { eventId } = appState;
                        return (
                            <Query query={bandsQuery} variables={{ eventId }}>
                                {
                                    ({ loading, error, data }) => {
                                        if (loading) {
                                            return <Loading/>;
                                        }
                                        if (error) return `Error! ${error.message}`;
                                        return data.bands.map((band) => this.renderBandRow(band));
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
