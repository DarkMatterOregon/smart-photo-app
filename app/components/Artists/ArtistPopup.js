import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import CachedImage from 'react-native-image-cache-wrapper';
import hexToRgba from 'hex-to-rgba';
import {  Button } from '../common';
import { success, dark, light, white, highlight } from '../../colors';
import { Actions } from 'react-native-router-flux';

export default class ArtistPopup extends Component {
    static propTypes = {
        artist: PropTypes.object,
        onClose: PropTypes.func,
        visible: PropTypes.bool
    };

    onGotoAwardElement = () => {
        const { artist, onClose } = this.props;
        onClose();
        Actions.awardElement({ element: artist });
    };

    render() {
        const { modal, container, header, headerImage, artistTextContainer, nameText, descriptionText, footer } = styles;
        const {
            visible,
            artist: {
                name = 'N/A',
                primaryImage: { url = '' },
                bandRoles = []
            },
            onClose
        } = this.props;

        return (
            <Modal
                style={modal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={visible}
                onBackButtonPress={onClose}
                onBackdropPress={onClose}
                onSwipeComplete={onClose}
                swipeDirection={['down', 'up']}
                hasBackdrop={true}
                backdropTransitionInTiming={0}
                backdropColor={dark}
                backdropOpacity={0.8}
            >
                <View style={container}>
                    <CachedImage
                        style={header}
                        imageStyle={headerImage}
                        source={{ uri: url }}
                        activityIndicator={<ActivityIndicator color={highlight} />}
                    >
                        <View style={artistTextContainer}>
                            <Text style={nameText}>{name}</Text>
                            <Text style={descriptionText}>{bandRoles.join(', ')}</Text>
                        </View>
                    </CachedImage>

                    <View style={footer}>
                        <Button onPress={onClose}>
                            Close
                        </Button>
                        <Button buttonType="INVERSE" onPress={this.onGotoAwardElement}>
                            Award Artist
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = {
    modal: {
        justifyContent: 'center',
        margin: 0,
        paddingHorizontal: 20
    },
    container: {
        justifyContent: 'center'
    },
    header: {
        aspectRatio: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    headerImage: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    artistTextContainer: {
        flex: 1,
        backgroundColor: hexToRgba(dark, 0.5)
    },
    nameText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
        paddingVertical: 2,
        color: white
    },
    descriptionText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 14,
        paddingVertical: 2,
        color: '#ffffff'
    },
    body: {
        borderTopColor: light,
        borderTopWidth: 1,
        flex: 4,
        padding: 5
    },
    bodyText: {
        color: light
    },
    footer: {
        backgroundColor: dark,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    closeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 0
    },
    closeButtonText: {
        fontSize: 20,
        textAlignVertical: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5
    },
    artistsButton: {
        backgroundColor: success
    },
    artistsButtonText: {
        color: light
    }
};
