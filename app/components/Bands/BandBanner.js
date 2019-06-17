import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, Text, Dimensions, ActivityIndicator } from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import hexToRgba from 'hex-to-rgba';
import { white, primary, highlight } from '../../colors';

export default class BandBanner extends Component {
    static propTypes = {
        bandName: PropTypes.string,
        onPress: PropTypes.func,
        imageUrl: PropTypes.string
    };

    constructor(props) {
        super(props);
        const { width } = Dimensions.get('window');

        this.state = {
            imageHeight: Math.floor((width * 9) / 16)
        };
    }

    render() {
        const { bandName, onPress, imageUrl } = this.props;
        const { imageHeight } = this.state;

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={{ height: imageHeight }}>
                    <CachedImage
                        source={{ uri: imageUrl }}
                        style={[styles.backdrop, { height: imageHeight }]}
                        activityIndicator={<ActivityIndicator color={highlight} />}
                    >
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{bandName}</Text>
                        </View>
                    </CachedImage>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    viewStyle: {
        flex: 1
    },
    backdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%'
    },
    titleContainer: {
        width: '100%',
        alignSelf: 'flex-start',
        backgroundColor: hexToRgba(primary, 0.75)
    },
    title: {
        fontSize: 22,
        paddingHorizontal: 12,
        paddingVertical: 4,
        color: white,
        textTransform: 'uppercase',
        fontWeight: '800'
    }
};
