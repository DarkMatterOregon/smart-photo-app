import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { dark, highlight, light } from '../colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: dark
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 24,
        color: light,
        marginTop: 20
    }
});

export default class Loading extends Component {
    static propTypes = {
        loadingText: PropTypes.string
    };

    renderLoadingText() {
        const { loadingText } = this.props;
        if (loadingText) {
            return <Text style={styles.loadingText}>{loadingText}</Text>;
        }
    }

    render() {
        return (
            <View style={[styles.container, styles.horizontal]}>
                <View style={{ flex: 1 }}>
                    <ActivityIndicator size="large" color={highlight} />
                    {this.renderLoadingText()}
                </View>
            </View>
        );
    }
}
