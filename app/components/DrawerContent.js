import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import headerImage from '../image/drawer-head-dark.png';

import { primary, light } from '../colors';
import guardian from '../../shared/AuthGuard';

class DrawerContent extends React.Component {
    onHome = () => {
        Actions.reset('homeView');
    };

    onLogout = () => {
        guardian.logout();
    };

    render() {
        return (
            <View style={styles.drawerContent}>
                <View style={styles.drawerHeader}>
                    <Image style={{ height: 100, width: 250 }} source={headerImage} />
                </View>

                <TouchableOpacity style={styles.buttonStyle} onPress={this.onHome}>
                    <View style={styles.optionRow}>
                        <Image style={styles.iconStyle} source={require('../image/icons/home.png')} />
                        <Text style={styles.textStyle}>Home</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonStyle} onPress={this.onLogout}>
                    <View style={styles.optionRow}>
                        <Image style={styles.iconStyle} source={require('../image/icons/sign-out.png')} />
                        <Text style={styles.textStyle}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    drawerHeader: {
        marginTop: 30,
        borderBottom: `${light} solid 2px`
    },
    drawerContent: {
        flexDirection: 'column',
        borderBottomWidth: 0,
        backgroundColor: primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        flex: 1
    },
    sectionText: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '200',
        paddingLeft: 8,
        paddingTop: 30,
        paddingBottom: 10
    },
    textStyle: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 20,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    optionRow: {
        flexDirection: 'row',
        marginLeft: 10
    },
    iconStyle: {
        alignSelf: 'center',
        height: 35,
        width: 35,
        paddingLeft: 20
    }
};

export default DrawerContent;
