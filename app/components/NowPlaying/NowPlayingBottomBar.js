import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { extraLight, extraDark, highlight } from '../../colors';

export default class NowPlayingBottomBar extends Component {
    static propTypes ={
        bands: PropTypes.array,
        currentBandId: PropTypes.string
    };

    gotoCurrentBand = (currentBandId, bandName) => () => {
        if (Actions.currentScene.toString() !== 'bandProfile') {
            Actions.bandProfile({ bandId: currentBandId, title: bandName });
        } else {
            Actions.refresh({ bandId: currentBandId, title: bandName });
        }
    };

    render() {
        const { headerTextStyle, bandNameTextStyle, containerStyle } = styles;
        const { bands, currentBandId } = this.props;

        if (!bands || bands.length === 0) {
            return null;
        }

        const currentBand = bands.find((band) => band.bandId === currentBandId);

        if (!currentBand) {
            return null;
        }

        const { nowPlayingImage, name: bandName} = currentBand;
        return (
            <TouchableOpacity style={containerStyle} onPress={this.gotoCurrentBand(currentBandId, bandName)}>
                <View style={{ flex: 1, alignSelf: 'center', padding: 5 }}>
                    <Image
                        style={{
                            resizeMode: 'stretch',
                            height: 80,
                            width: 80
                        }}
                        source={{ uri: nowPlayingImage.url }}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'column',
                        flex: 3,
                        justifyContent: 'center'
                    }}
                >
                    <Text style={headerTextStyle}>On Stage Now!</Text>
                    <Text style={bandNameTextStyle}>{bandName}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = {
    headerTextStyle: {
        fontSize: 18,
        justifyContent: 'flex-start',
        color: highlight,
        paddingLeft: 10
    },
    bandNameTextStyle: {
        fontSize: 18,
        justifyContent: 'flex-start',
        fontWeight: 'bold',
        color: extraLight,
        paddingLeft: 10
    },
    containerStyle: {
        justifyContent: 'center',
        height: 80,
        bottom: 0,
        position: 'relative',
        backgroundColor: extraDark,
        flexDirection: 'row'
    }
};
