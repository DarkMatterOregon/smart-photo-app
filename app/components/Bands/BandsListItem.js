import React, { Component } from 'react';
import { Text, TouchableHighlight, View, LayoutAnimation, NativeModules } from 'react-native';
import { Button } from '../common';
import { dark, light, white, highlight, primary, secondary } from '../../colors';
import { Actions } from 'react-native-router-flux';
import BandBanner from './BandBanner';
import { bold } from 'ansi-colors';

const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class BandsListItem extends Component {
    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    onAwardPressed = data => () => {
        Actions.awardElement({ element: data, awards: data.awards });
    };

    renderAwardSection() {
        const { data } = this.props;
        return (
            <View style={styles.awardButtonSection}>
                <Button onPress={this.onAwardPressed(data)}>Award Band</Button>
            </View>
        );
    }

    renderArtist(artist) {
        const { name, bandRoles = [], musicianId } = artist;

        return (
            <TouchableHighlight
                key={musicianId}
                style={styles.artistButton}
                underlayColor={highlight}
                onPress={() => this.props.onArtistPressed(artist)}
            >
                <View style={styles.artistContainer}>
                    <Text style={styles.artistText}>{name}</Text>
                    <Text style={styles.artistRoles}>{bandRoles.join(', ')}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderBandDetails() {
        const { data, selectedDataItemId } = this.props;
        const expanded = data.bandId === selectedDataItemId;

        if (expanded) {
            return (
                <View style={styles.bandDetails}>
                    <View style={styles.details}>
                        <Text style={styles.detailsHeaderText}>Band Members</Text>
                        {data.bandArtists.map(artist => this.renderArtist(artist))}
                    </View>
                    {this.renderAwardSection()}
                </View>
            );
        }
    }

    render() {
        const { name, imageUrl } = this.props.data;

        return (
            <View>
                <BandBanner
                    onPress={() => this.props.selectDataItem(this.props.data)}
                    bandName={name}
                    imageUrl={imageUrl}
                />
                {this.renderBandDetails()}
            </View>
        );
    }
}

const styles = {
    bandDetails: {
        backgroundColor: dark
    },
    details: {
        flexDirection: 'column',
        marginBottom: 8
    },
    detailsHeaderText: {
        fontSize: 18,
        fontWeight: '800',
        color: white,
        paddingLeft: 8,
        paddingVertical: 8,
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'center'
    },
    detailsText: {
        fontSize: 14,
        padding: 8,
        color: light,
        fontWeight: 400,
        marginBottom: 8
    },
    artistButton: {
        backgroundColor: dark,
        borderTopWidth: 0.5,
        borderTopColor: primary,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    artistContainer: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    artistText: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 16,
        color: light,
        marginTop: 10,
        marginBottom: 10
    },
    artistRoles: {
        textAlign: 'right',
        textAlignVertical: 'center',
        fontSize: 12,
        color: light,
        marginTop: 10,
        marginBottom: 10
    },
    awardButtonSection: {
        paddingTop: 10,
        paddingBottom: 10
    }
};
