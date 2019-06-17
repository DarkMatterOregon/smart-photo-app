import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AppConsumer } from '../../App';
import BandBanner from './BandBanner';
import MusiciansInBand from './MusiciansInBand';

import NowPlayingPageWrapper from '../NowPlaying/NowPlayingPageWrapper';

export default class BandProfile extends Component {
    static propTypes = {
        bandId: PropTypes.string
    };

    onBandPress = (element) => () => {
        Actions.awardElement({ element })
    };

    render() {
        const { bandId } = this.props;

        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventId, eventData: { artists = [], awards = [], bands = [] } } = appState;

                    const band = bands.find((band) => band.bandId === bandId);
                    const { musicians, name, primaryImage } = band;

                    const aIds = musicians.map(aIds => aIds.musicianId);
                    const bandMusicians = artists.filter(a => aIds.includes(a.musicianId));

                    return (
                        <NowPlayingPageWrapper eventId={eventId}>
                            <View style={styles.profileContainer} key={bandId}>
                                <BandBanner bandName={name} imageUrl={primaryImage.url} onPress={this.onBandPress(band)} />
                                <MusiciansInBand musicians={bandMusicians} />
                            </View>
                        </NowPlayingPageWrapper>
                    );
                }}
            </AppConsumer>
        );
    }
}

const styles = {
    profileContainer: {
        flex: 6,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    }
};
