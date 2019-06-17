import React, { Component } from 'react';
import { Image, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import hexToRgba from 'hex-to-rgba';
import { Actions } from 'react-native-router-flux';
import PhotoGrid from '../common/PhotoGrid';
import { light, dark, primary, secondary, white } from '../../colors';

export default class MusiciansInBand extends Component {
    state = { items: [] };

    componentDidMount() {
        this.setState({
            items: this.props.musicians.map((musician) => (
                {
                    ...musician,
                    id: musician.musicianId,
                    src: musician.bandProfileImage.url
                }
            ))
        });
    }

    onMusicianPress = (element) => () => {
        Actions.awardElement({ element })
    };

    renderItem = (item, itemSize, itemPaddingHorizontal) => {
        return (
            <TouchableOpacity
                key={item.id}
                style={{
                    width: itemSize,
                    height: itemSize,
                    paddingHorizontal: itemPaddingHorizontal
                }}
                onPress={this.onMusicianPress(item)}>
                <Image
                    resizeMode="cover"
                    style={{ flex: 1 }}
                    source={{ uri: item.src }}
                />
                <View style={styles.musicianImageOverlay}>
                    <View style={styles.musicianDetailsContainer}>
                        <Text style={styles.musicianName}>{item.name}</Text>
                        {item.bandRoles.length > 0 && <Text style={styles.musicianBandRoles}>{item.bandRoles.join(', ')}</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View style={styles.containerStyle}>
                <PhotoGrid
                    data={this.state.items}
                    itemsPerRow={2}
                    itemMargin={1}
                    itemPaddingHorizontal={5}
                    renderItem={this.renderItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: 'center',
        flex: 1,
        marginTop: 20,
    },
    fullImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '98%',
        resizeMode: 'contain',
    },
    closeButtonStyle: {
        width: 25,
        height: 25,
        top: 9,
        right: 9,
        position: 'absolute',
    },
    musicianImageOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginLeft: 5
    },
    musicianDetailsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: hexToRgba(dark, 0.5),
        width: '100%',
        padding: 3
    },
    musicianName: {
        color: light,
        fontWeight: '800',
        fontSize: 18
    },
    musicianBandRoles: {
        color: light,
        fontSize: 14,
        textAlign: 'right'
    }
});


