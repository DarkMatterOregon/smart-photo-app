import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BaseView } from './common';
import { guardian } from '../../shared/AuthGuard';
import { Actions } from 'react-native-router-flux';


export default class LoginWithAccount extends Component {
    onLogin = () => {
        guardian.loginWithEmailAndPassword('steamedcotton@gmail.com', '')
            .then(() => {
                Actions.main();
            })
            .catch((err) => console.log(err))
    };

    render() {
        return (
            <BaseView>
                <TouchableOpacity style={styles.buttonTouchable} onPress={this.onLogin}>
                    <Text style={styles.buttonText}>OK. Got it!</Text>
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
