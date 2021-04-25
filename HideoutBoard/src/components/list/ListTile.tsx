import React from "react";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import {  View } from "../Themed";

type ListTileProps = {
    style?: StyleProp<ViewStyle>;
}

const ListTile = (props: ListTileProps &  Readonly<{children?: React.ReactNode;}>): JSX.Element => {
    return (
        <View style={[styles.container, props.style]}>
            {props.children}
        </View>
    );
};

export default ListTile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingVertical:"2%",
        backgroundColor: "#252525",
        // marginVertical: "2%",
    }
});
