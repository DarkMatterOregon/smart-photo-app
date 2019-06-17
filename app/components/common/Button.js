import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity } from 'react-native';
import { dark, primary, secondary, highlight, white } from '../../colors';

export default class Button extends Component {
    static NORMAL = 'NORMAL';
    static INVERSE = 'INVERSE';

    static propTypes = {
        buttonStyleOverwrite: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        textStyleOverwrite: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
        buttonType: PropTypes.string,
        onPress: PropTypes.func
    };

    static defaultProps = {
        buttonType: 'NORMAL'
    };

    render() {
        const {
            onPress,
            children,
            buttonStyle,
            buttonStyleOverwrite,
            textStyle,
            textStyleOverwrite,
            buttonType
        } = this.props;

        const buttonStyles = [styles.baseButton];
        const buttonTextStyles = [styles.baseButtonText];

        switch (buttonType) {
            case Button.INVERSE:
                buttonStyles.push(styles.inverseButton);
                buttonTextStyles.push(styles.inverseButtonText);
                break;
            default:
                buttonStyles.push(styles.normalButton);
                buttonTextStyles.push(styles.normalButtonText);
        }

        buttonStyles.push(buttonStyle);
        buttonTextStyles.push(textStyle);

        return (
            <TouchableOpacity style={[buttonStyles, buttonStyleOverwrite]} onPress={onPress}>
                <Text style={[buttonTextStyles, textStyleOverwrite]}>{children}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = {
    baseButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 5,
        alignSelf: 'stretch'
    },
    baseButtonText: {
        fontSize: 21,
        marginHorizontal: 16,
        marginVertical: 21
    },

    normalButton: {
        backgroundColor: secondary
    },
    normalButtonText: {
        color: white
    },

    inverseButton: {
        backgroundColor: primary,
        borderColor: dark
    },
    inverseButtonText: {
        color: white
    }
};
