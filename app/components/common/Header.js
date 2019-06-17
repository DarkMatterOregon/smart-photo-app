import React from 'react';
import { Text, View } from 'react-native';

// Make header component
const Header = (props) =>
{
    const { textStyle, viewStyle } = styles;
    return(
        <View style = { viewStyle }>
        <Text style = { textStyle }>{props.headerText}</Text>
        </View>
    );
};

const styles = {
    textStyle: {
        fontSize: 20
    },
    viewStyle:{
        backgroundColor: '#3d819f',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2},
        shadowOpacity: 0.3,
        elevation: 2,
    }
};

// Make header component available to other parts of the app
export {Header};

