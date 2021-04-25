import React from "react";
import { ScrollView, StyleSheet, Text, View, } from "react-native";
import ListTile from "./ListTile";

const ScrollableList = (props: Readonly<{children?: React.ReactNode;}>): JSX.Element => {

    const items = props.children.map( c => {
        return(
            <View>
                {c}
                {/* <View style={styles.separator}/> */}
            </View>
        );
    });

    return (
        <ScrollView  style={styles.items}>
            {items}
        </ScrollView >
    );
};

export default ScrollableList;

const styles = StyleSheet.create({

    items: {
        flex: 1,
        marginBottom: 100
    },
    separator: {
        color: "#000",
        backgroundColor: "#FFC0CB",
        height: 2,
        borderColor : "#000",
    }

});
