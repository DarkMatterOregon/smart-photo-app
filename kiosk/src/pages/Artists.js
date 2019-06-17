import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { AppConsumer } from '../App';
import Loading from '../components/Loading';

export const artistQuery = gql`
    query artistQuery($eventId: String!) {
        artists: getMusiciansByEvent(eventId: $eventId) {
            name
            musicianId
            primaryImage(aspectRatio: "1x1", maxWidth: 550) {
                url
            }
        }
    }
`;

export default class Artists extends Component {
    static defaultProps = {};

    static propTypes = {};

    state = {};

    linkToPage = (path) => () => {
        this.props.history.push(path);
    };

    renderArtistCard(artist) {
        const { name, musicianId, primaryImage } = artist;

        return (
            <div className="artist-card" key={musicianId} onClick={this.linkToPage(`/artists/${musicianId}`)}>
                <img className="artist-image" src={primaryImage.url} />
                <div className="artist-name">{name}</div>
            </div>
        );

    }

    render() {
        return (
            <div className="artist-view navbar-spacer">
                <AppConsumer>
                    {(appState) => {
                        const { eventId } = appState;
                        return (
                            <Query query={artistQuery} variables={{ eventId }}>
                                {
                                    ({ loading, error, data }) => {
                                        if (loading) {
                                            return <Loading/>;
                                        }
                                        if (error) return `Error! ${error.message}`;
                                        return data.artists.map((artist) => this.renderArtistCard(artist));
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
