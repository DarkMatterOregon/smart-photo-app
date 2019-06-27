import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, CameraRoll, PermissionsAndroid } from 'react-native';
import PhotoGrid from "../components/PhotoGrid";

export default class HomeView extends Component {
    state = { photos: [
        { id: 0, src: "https://picsum.photos/200"},
        { id: 1, src: "https://picsum.photos/200"},
        { id: 2, src: "https://picsum.photos/200"},
        { id: 3, src: "https://picsum.photos/200"},
        { id: 4, src: "https://picsum.photos/200"},
        { id: 5, src: "https://picsum.photos/200"},
        { id: 6, src: "https://picsum.photos/200"}
    ] };

    getCameraRoll_TEST() {
        this.requestCameraRollPermission().then((granted) => {
            if (granted) {
                CameraRoll.getPhotos({ first: 20, assetType: "Photos" }).then(r => {
                    let cameraRoll = [];
                    for (i = 0; i < 20; i++) {
                        cameraRoll.push({id: i, src: "https://picsum.photos/200"});
                    }
            
                    this.setState({ photos: cameraRoll });
                });
            } else {
                alert("Cannot load camera roll.");
            }
        })
    }

    getCameraRoll() {
        this.requestCameraRollPermission().then((granted) => {
            if (granted) {
                CameraRoll.getPhotos({ first: 20, assetType: "Photos" }).then(r => {
                    let cameraRoll = [];

                    for (i = 0; i < r.edges.length; i++) {
                        cameraRoll.push({ id: i, src: r.edges[i].node.image.uri });
                    }
                    this.setState({ photos: cameraRoll });
                });

            } else {
                alert("Cannot load camera roll.");
            }
        })
    }

    async requestCameraRollPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Smart Photos App",
                    message: "Smart Photos App needs access to your camera roll.",
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted == PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
    
    renderItem = (item, itemSize, itemPaddingHorizontal) => {
        return (
            <Image
                key={item.id}
                resizeMode="cover"
                style={{
                    flex: 1,
                    width: itemSize,
                    height: itemSize,
                    paddingHorizontal: itemPaddingHorizontal
                }}
                source={{ uri: item.src }}
            />
        );
    }

    render() {
        this.getCameraRoll();
        //this.getCameraRoll_TEST();

        return (
            <View style={styles.container}>
                <PhotoGrid
                    data={this.state.photos}
                    itemsPerRow={3}
                    itemMargin={1}
                    itemPaddingHorizontal={10}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#222",
        justifyContent: 'center',
        flex: 1,
    }
});