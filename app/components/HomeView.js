import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Text, Dimensions, PixelRatio } from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import { Actions } from 'react-native-router-flux';
import { Query } from 'react-apollo';
import { fetchAllQuery } from '../../shared/queries';

import { BaseView } from './common';
import Loading from './Loading';
import NowPlayingPageWrapper from './NowPlaying/NowPlayingPageWrapper';
import { dark, light, highlight } from '../colors';
import awardIcon from '../image/icons/awards.png';
import bandIcon from '../image/icons/bands.png';
import artistIcon from '../image/icons/artist.png';

import { AppConsumer } from '../App';

const { width } = Dimensions.get('window');
const halfWidth = Math.floor(width/2.2);

export default class HomeView extends Component {
    state = {
        eventImageWidthPixels: PixelRatio.getPixelSizeForLayoutSize(width),
        bandImageWidthPixels: PixelRatio.getPixelSizeForLayoutSize(width),
        bandNowPlayingImageWidthPixels: PixelRatio.getPixelSizeForLayoutSize(80), // TODO: Move width to better location
        musicianImageWidthPixels: PixelRatio.getPixelSizeForLayoutSize(240), // TODO: Move width to better location
        musicianBandImageWidthPixels: PixelRatio.getPixelSizeForLayoutSize(halfWidth)
    };

    onBandsPressed = () => {
        Actions.bandsView();
    };

    onArtistsPressed = () => {
        Actions.artistsView();
    };

    onAwardsPressed = () => {
        Actions.awardsView();
    };

    renderEvent(data, eventId) {
        const { event } = data;
        return (
            <NowPlayingPageWrapper eventId={eventId}>
                <View style={{ flex: 6 }}>
                    <CachedImage
                        style={styles.eventBanner}
                        source={{ uri: event.primaryImage.url }}
                        activityIndicator={<ActivityIndicator color={highlight} />}
                    >
                        <Text style={styles.eventBannerText}>{event.name}</Text>
                    </CachedImage>

                    <View style={styles.eventSections}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.button} onPress={this.onBandsPressed}>
                                <Image style={styles.buttonImage} source={bandIcon} />
                                <Text style={styles.buttonText}>Bands</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.button} onPress={this.onArtistsPressed}>
                                <Image style={styles.buttonImage} source={artistIcon} />
                                <Text style={styles.buttonText}>Artists</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.button} onPress={this.onAwardsPressed}>
                                <Image style={styles.buttonImage} source={awardIcon} />
                                <Text style={styles.buttonText}>Awards</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </NowPlayingPageWrapper>
        );
    }

    renderError(error) {
        // TODO: Add better error logging
        return (
            <BaseView baseViewStyle={{ backgroundColor: dark }}>
                <Text style={styles.buttonText}>Error: {error}</Text>
            </BaseView>
        );
    }

    renderEventNotSupported() {
        return (
            <BaseView baseViewStyle={{ backgroundColor: dark }}>
                <View style={styles.centeredContent}>
                    <Text style={styles.notSupportedHeader}>Event type not supported</Text>
                    <Text style={styles.notSupportedDetails}>
                        The selected event is not supported in this version of the Fanosity app.
                        Please update the app to get all the latest event support.
                    </Text>
                </View>
            </BaseView>
        );
    }

    render() {
        const { eventImageWidthPixels, bandImageWidthPixels, musicianImageWidthPixels } = this.state;
        return (
            <AppConsumer>
                {({ appState, updateEventData }) => {
                    const { eventId } = appState;

                    if (!eventId) {
                        return this.renderError('Invalid Event Id');
                    }

                    const queryParams = {
                        eventId,
                        eventImageWidthPixels,
                        bandImageWidthPixels,
                        musicianImageWidthPixels
                    };

                    return (
                        <Query
                            query={fetchAllQuery}
                            variables={queryParams}
                            onCompleted={({ artists, bands, awards }) => {
                                updateEventData({ artists, bands, awards });
                            }}
                        >
                            {({ loading, error, data }) => {
                                if (loading) {
                                    return <Loading loadingText="Loading Event Data ..." />;
                                }

                                if (error) {
                                    return this.renderError(error.message);
                                }

                                // This app currently only supports MAB type
                                const { event } = data;
                                if (event.eventType !== 'MAKE_A_BAND_COMPETITION') {
                                    return this.renderEventNotSupported();
                                }

                                return this.renderEvent(data, eventId);
                            }}
                        </Query>
                    );
                }}
            </AppConsumer>
        );
    }
}

const styles = {
    button: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: dark,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#111',
        marginLeft: 0,
        marginRight: 0,
        justifyContent: 'center',
        activeOpacity: 0.1,
        alignItems: 'center'
    },
    buttonImage: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        alignSelf: 'center',
        color: light,
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },

    eventBanner: {
        flex: 3,
        padding: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        resizeMode: 'center'
    },

    eventBannerText: {
        color: light,
        fontSize: 20,
        fontWeight: '600',
        paddingBottom: 10
    },

    eventSections: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 10
    },
    notSupportedHeader: {
        color: light,
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10
    },
    notSupportedDetails: {
        color: light,
        fontSize: 14
    }
};
