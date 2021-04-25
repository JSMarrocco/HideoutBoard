/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {  } from "react";
import { StyleSheet} from "react-native";
import { AppbarHeader, View } from "../Themed";
import { Route, WallPicture } from "../walls/WallComponents";
import { Appbar } from "react-native-paper";
import WallView from "../walls/WallView";

type RouteViewComponentProps = {
    route: Route;
    picture: WallPicture;
    cancelAction: () => void;
}

const RouteViewComponent = (props: RouteViewComponentProps): JSX.Element => {
    return (
        <View style={styles.container}>
            <AppbarHeader>
                <Appbar.Action icon="arrow-left" onPress={() => {props.cancelAction();}} />
                <Appbar.Content title={props.route.name}  subtitle={props.route.difficulty}/>
            </AppbarHeader>
            <WallView photo={props.picture} holds={props.route.holds}  isCreatingRoute={false}/>
        </View>
    );
};

export default RouteViewComponent;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        backgroundColor: "transparent",
        justifyContent: "space-evenly",
        flexWrap: "nowrap",
        flex: 1,

    }
});