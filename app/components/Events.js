import React, { Component } from 'react';
import { TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';
import { BaseView, Placemat, Button } from './common';
import { Actions } from 'react-native-router-flux';
import { highlight } from '../colors';

export default class Events extends Component {
    onEventSelect = () => {
        Actions.homeView();
    };

    render() {
        const { backdrop, eventImage } = styles;
        return (
            <BaseView>
                <Placemat style={{ padding: 0 }}>
                    <TouchableOpacity style={backdrop} onPress={this.onEventSelect}>
                        <CachedImage
                            style={eventImage}
                            source={require('../image/mab_banner.png')}
                            activityIndicator={<ActivityIndicator color={highlight} />}
                        />
                    </TouchableOpacity>
                </Placemat>
            </BaseView>
        );
    }
}

const styles = {
    backdrop: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        height: 160
    },
    eventImage: {
        flex: 1,
        resizeMode: 'stretch',
        height: 120
    }
};
