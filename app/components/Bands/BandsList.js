import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import BandsListItem from './BandsListItem';
import ArtistPopup from '../Artists/ArtistPopup';
import { Actions } from 'react-native-router-flux';
import { AppConsumer } from '../../App';
import NowPlayingPageWrapper from '../NowPlaying/NowPlayingPageWrapper';

const EMPTY_DATA_ITEM_ID = -1;
const EMPTY_ARTIST = { musicianId: null, name: 'Artist name here', description: null, primaryImage: { url: null } };

export default class BandsList extends Component {
    constructor(props) {
        super(props);
        const { scrollTo = EMPTY_DATA_ITEM_ID } = props;

        this.state = {
            selectedDataItemId: scrollTo,
            showingArtist: false,
            shownArtist: EMPTY_ARTIST,
            showingAward: false,
            awardingBand: {}
        };
    }

    getItemLayout = (data, index) => ({
        length: 160,
        offset: 160 * index,
        index
    });

    selectDataItem = (item) => {
        const { selectedDataItemId } = this.state;

        if (selectedDataItemId === item.bandId || item === -1) {
            this.setState({ selectedDataItemId: EMPTY_DATA_ITEM_ID });
        } else {
            this.setState({ selectedDataItemId: item.bandId });
        }
    };

    // Artist Popup Handlers
    onArtistPressed = artist => {
        this.setState({ showingArtist: true, shownArtist: artist });
    };

    onCloseArtist = () => {
        this.setState({ showingArtist: false });
    };

    onCloseAwards = () => {
        this.setState({ showingAward: false });
    };

    // scrollToIndex(id) {
    //     const { bands } = this.props;
    //
    //     if (id !== null)
    //         this.listRef.scrollToIndex({
    //             animated: true,
    //             index: bands.findIndex(item => item.bandId === id)
    //         });
    // }

    renderBandRow = ({ item }) => {
        const {
            bandId,
            name,
            primaryImage: { url },
            musicians,
            elementType
        } = item;

        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventData: { artists = [], awards = [] } } = appState;
                    const aIds = musicians.map(aIds => aIds.musicianId);
                    const bandArtists = artists.filter(a => aIds.includes(a.musicianId));

                    const itemData = {
                        bandId,
                        elementId: bandId,
                        elementType,
                        name,
                        description: name,
                        bio: name,
                        imageUrl: url,
                        bandArtists,
                        awards
                    };
                    const { selectedDataItemId = EMPTY_DATA_ITEM_ID } = this.state;

                    return (
                        <BandsListItem
                            data={itemData}
                            selectedDataItemId={selectedDataItemId}
                            selectDataItem={this.selectDataItem}
                            onArtistPressed={this.onArtistPressed}
                        />
                    );
                }}
            </AppConsumer>
        );
    };

    renderBands() {
        const { scrollTo } = this.props;

        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventData: { bands = [] }} = appState;
                    const scrollToIndex = bands.map((band) => band.bandId).indexOf(scrollTo);

                    return (
                        <FlatList
                            data={bands}
                            renderItem={this.renderBandRow}
                            keyExtractor={({ bandId }) => bandId.toString()}
                            getItemLayout={this.getItemLayout}
                            ref={ref => { this.listRef = ref; }}
                            initialNumToRender={bands.length}
                            initialScrollIndex={scrollToIndex}
                            extraData={this.state}
                            onLayout={this.onLayout}
                        />
                    )
                }}
            </AppConsumer>
        );
    }

    render() {
        const {
            showingArtist = false,
            shownArtist = EMPTY_ARTIST
        } = this.state;

        return (
            <AppConsumer>
                {({ appState }) => {
                    const { eventId } = appState;
                    return (
                        <NowPlayingPageWrapper eventId={eventId}>
                            <View style={{ flex: 6 }}>
                                {this.renderBands()}
                                <ArtistPopup
                                    visible={showingArtist}
                                    artist={shownArtist}
                                    onClose={this.onCloseArtist}
                                />
                            </View>
                        </NowPlayingPageWrapper>
                    );
                }}
            </AppConsumer>
        );
    }
}
