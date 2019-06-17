import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import ArtistsListItem from './ArtistsListItem';
import { AppConsumer } from '../../App';
import NowPlayingPageWrapper from '../NowPlaying/NowPlayingPageWrapper';

import { dark, primary, secondary } from '../../colors';
const EMPTY_DATA_ITEM_ID = -1;

export default class ArtistsList extends Component {
    constructor(props) {
        super(props);
        const { scrollTo = EMPTY_DATA_ITEM_ID } = props;

        this.state = {
            selectedDataItemId: scrollTo
        };
    }

    selectDataItem = (item) => {
        const { selectedDataItemId } = this.state;

        if (selectedDataItemId === item.musicianId || item === -1) {
            this.setState({ selectedDataItemId: EMPTY_DATA_ITEM_ID });
        } else {
            this.setState({ selectedDataItemId: item.musicianId });
        }
    };

    getItemLayout = (data, index) => ({
        length: 120,
        offset: 120 * index,
        index
    });

    renderArtistRow = ({ item }) => {
        const {
            musicianId,
            primaryImage: { url }
        } = item;

        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventData: { bands = [], awards = [] } } = appState;
                    const artistBand = bands.find(band => band.musicians.find(aId => aId.musicianId === musicianId));

                    const artistData = {
                        ...item,
                        imageUrl: url,
                        artistBand,
                        awards
                    };
                    const { selectedDataItemId = EMPTY_DATA_ITEM_ID } = this.state;

                    return (
                        <ArtistsListItem
                            data={artistData}
                            selectedDataItemId={selectedDataItemId}
                            selectDataItem={this.selectDataItem}
                        />
                    );
                }}
            </AppConsumer>
        );
    };

    renderArtists(artists) {
        const { scrollTo } = this.props;
        const scrollToIndex = artists.map((artist) => artist.musicianId).indexOf(scrollTo);

        return (
            <FlatList
                data={artists}
                renderItem={this.renderArtistRow}
                keyExtractor={({ musicianId }) => musicianId.toString()}
                getItemLayout={this.getItemLayout}
                ref={ref => { this.listRef = ref; }}
                initialNumToRender={artists.length}
                initialScrollIndex={scrollToIndex}
                extraData={this.state}
                onLayout={this.onLayout}
                style={{ styles }}
            />
        );
    }

    render() {
        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventId, eventData: { artists = [] } } = appState;
                    return (
                        <NowPlayingPageWrapper eventId={eventId}>
                            <View style={{ flex: 6 }}>
                                {this.renderArtists(artists)}
                            </View>
                        </NowPlayingPageWrapper>
                    );
                }}
            </AppConsumer>
        );
    }
}

const styles = {
    awardTextStyle: {
        fontSize: 22,
        textAlign: 'left',
        lineHeight: 40,
        color: '#000'
    },
    titleTextStyle: {
        fontStyle: 'italic'
    },
    awardTextContainerStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        height: 45,
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        margin: 10
    }
};
