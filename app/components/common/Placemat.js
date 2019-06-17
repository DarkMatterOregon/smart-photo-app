import React from "react";
import { View } from "react-native";
import { dark, light } from "../../colors";

const Placemat = props => {
    return <View style={[styles.containerStyle, props.style]}>{props.children}</View>;
};
const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        backgroundColor: dark,
        justifyContent: "flex-start",
        flexDirection: "row",
        padding: 5,
        position: "relative"
    }
};

export { Placemat };
