import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, LayoutAnimation, NativeModules } from 'react-native';
import { Placemat, Button } from '../common';
import ArtistBanner from './ArtistBanner';
import { Actions } from 'react-native-router-flux';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class ArtistsListItem extends Component {
    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    onAwardPressed = data => () => {
        Actions.awardElement({ element: data, awards: data.awards });
    };

    renderAwardSection() {
        const { data } = this.props;
        // TODO add artist first name versus artist to button
        return (
            <View style={styles.awardSection}>
                <Button onPress={this.onAwardPressed(data)}>Award Artist</Button>
            </View>
        );
    }

    renderExpandedSection() {
        const expanded = this.props.data.musicianId === this.props.selectedDataItemId;

        if (expanded) {
            return <View>{this.renderAwardSection()}</View>;
        }
    }

    render() {
        const {
            imageUrl,
            bandRoles,
            artistBand: { name: bandName } = { name: 'EMPTY' },
            name: artistName = 'n/a'
        } = this.props.data;

        return (
            <View>
                <ArtistBanner
                    onPress={() => this.props.selectDataItem(this.props.data)}
                    artistName={artistName}
                    bandName={bandName}
                    bandRoles={bandRoles}
                    imageUrl={imageUrl}
                />
                {this.renderExpandedSection()}
            </View>
        );
    }
}

const styles = {
    awardSection: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10
    }
};
