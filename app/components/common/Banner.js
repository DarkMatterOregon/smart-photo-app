import React from 'react';
import { View, TouchableWithoutFeedback, ImageBackground, Text, ActivityIndicator } from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import hexToRgba from 'hex-to-rgba';
import { dark, highlight } from '../../colors';

const Banner = ({ title, desc, onPress, image }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View>
                <CachedImage
                    source={image}
                    style={styles.backdrop}
                    activityIndicator={<ActivityIndicator color={highlight} />}
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                </CachedImage>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = {
    backdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: 160
    },
    titleContainer: {
        alignSelf: 'flex-start',
        backgroundColor: hexToRgba(dark, 0.5)
    },
    title: {
        backgroundColor: hexToRgba(dark, 0.5),
        fontSize: 22,
        paddingHorizontal: 12,
        paddingVertical: 4,
        // paddingLeft: 8,
        // paddingRight: 8,
        color: '#ffffff'
    },
    dataContainerStyle: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: 260,
        height: 80,
        position: 'relative',
        backgroundColor: 'rgba(10, 10, 15, 0.6)'
    }
};

export { Banner };
