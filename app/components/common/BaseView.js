import React from 'react';
import { View } from 'react-native';
import { dark } from '../../colors';

export default ({ children, baseViewStyle }) => {
    return <View style={[styles.containerStyle, baseViewStyle]}>{children}</View>;
};

const styles = {
    containerStyle: {
        borderBottomWidth: 0,
        backgroundColor: dark,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        flex: 1
    }
};
