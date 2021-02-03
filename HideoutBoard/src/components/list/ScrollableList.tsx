import React from "react";
import { ScrollView, StyleSheet, Text, View, } from "react-native";
import ListTile from "./ListTile";

const ScrollableList = (props: Readonly<{children?: React.ReactNode;}>): JSX.Element => {

    const items = props.children.map( c => {
        return(
            <View>
                {c}
                <View style={styles.separator}/>
            </View>
        );
    });

    return (
        <View style={styles.container}>
            <ScrollView  style={styles.items}>
                {items}
            </ScrollView >
        </View>
    );
};

export default ScrollableList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "flex-start"
    },
    items: {
        flex: 1,
        // marginBottom: 100
    },
    separator: {
        color: "#000",
        backgroundColor: "#000",
        height: 2,
        borderColor : "#000",
    }

});
