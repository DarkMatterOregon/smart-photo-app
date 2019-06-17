import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { BaseView } from './common';
import guardian from '../../shared/AuthGuard';


export default class LoginWithAccount extends Component {
    navTo = (page) => () => {
        Actions[page]();
    };

    checkLogin = () => {
        // TODO: Remove once this and the button once it is not needed
        console.log('Is Logged In: ', guardian.isLoggedIn());
    };

    render() {
        return (
            <BaseView>
                <TouchableOpacity style={styles.buttonTouchable} onPress={this.navTo('loginWithAccount')}>
                    <Text style={styles.buttonText}>Login With Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonTouchable} onPress={this.navTo('loginWithBallotQrCode')}>
                    <Text style={styles.buttonText}>Scan Event Ballot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonTouchable} onPress={this.checkLogin}>
                    <Text style={styles.buttonText}>Check Login</Text>
                </TouchableOpacity>
            </BaseView>
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 30,
        padding: 32,
        color: '#777',
        textAlign: 'center'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: '#e1e1e1'
    },
    buttonTouchable: {
        padding: 16,
        backgroundColor: '#5c74ff'
    }
});
