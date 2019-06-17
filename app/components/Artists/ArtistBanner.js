import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, ActivityIndicator, Text } from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import { dark, light, highlight, white, primary } from '../../colors';

export default class ArtistBanner extends Component {
    static propTypes = {
        artistName: PropTypes.string,
        bandName: PropTypes.string,
        bandRoles: PropTypes.array,
        onPress: PropTypes.func,
        imageUrl: PropTypes.string
    };

    renderBandRoles(bandRoles = []) {
        return (
            <Text style={styles.bandRoles}>{bandRoles.join(', ')}</Text>
        );
    }

    render() {
        const { artistName, bandName, bandRoles, onPress, imageUrl } = this.props;

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.background}>
                    <View style={styles.textContainer}>
                        <Text style={styles.artistName}>{artistName}</Text>
                        <Text style={styles.bandName}>{bandName}</Text>
                        {this.renderBandRoles(bandRoles)}
                    </View>
                    <CachedImage
                        source={{uri: imageUrl }}
                        style={styles.image}
                        activityIndicator={<ActivityIndicator color={highlight} />}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    background: {
        backgroundColor: primary,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 120
    },
    textContainer: {
        flex: 1,
        backgroundColor: dark,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 2
    },
    artistName: {
        textAlign: 'left',
        fontSize: 22,
        paddingHorizontal: 12,
        paddingVertical: 4,
        color: white
    },
    bandName: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 14,
        paddingHorizontal: 12,
        color: light
    },
    bandRoles: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 14,
        paddingHorizontal: 12,
        color: light
    },
    image: {
        height: 116,
        width: 116,
        paddingTop: 2,
        alignSelf: 'center'
    }
};
