import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { light, primary, white } from '../../colors';


export default class AwardsListItem extends Component {
    static propTypes = {
        data: PropTypes.object
    };

    render() {
        const { name, description } = this.props.data;
        return (
            <View style={styles.awardContainer}>
                <Text style={styles.awardTitle}>{name}</Text>
                <Text style={styles.awardDetails}>{description}</Text>
            </View>
        );
    }
}

const styles = {
    awardContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        borderTop: primary,
        borderWidth: 2,
        padding: 8
    },
    awardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: white,
        paddingLeft: 8,
        paddingVertical: 8
    },
    awardDetails: {
        fontSize: 16,
        paddingLeft: 8,
        color: light,
        marginBottom: 10
    }
};
