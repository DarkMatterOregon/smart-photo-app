import React, { Component } from "react";
import { FlatList, View } from "react-native";
import AwardsListItem from "./AwardsListItem";
import { AppConsumer } from '../../App';
import NowPlayingPageWrapper from '../NowPlaying/NowPlayingPageWrapper';

export default class AwardsList extends Component {
    renderItem = ({ item }) => {
        return <AwardsListItem data={item} />;
    };

    renderList(awards) {
        return (
            <FlatList
                data={awards}
                renderItem={this.renderItem}
                keyExtractor={({ awardId }) => awardId.toString()}
                ref={ref => { this.listRef = ref; }}
            />
        );
    }

    render() {
        return (
            <AppConsumer>
                {({ appState = {} }) => {
                    const { eventId, eventData: { awards = [] } } = appState;
                    return (
                        <NowPlayingPageWrapper eventId={eventId}>
                            <View style={{ flex: 6 }}>{this.renderList(awards)}</View>
                        </NowPlayingPageWrapper>
                    );
                }}
            </AppConsumer>
        );
    }
}
