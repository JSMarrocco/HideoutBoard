/* eslint-disable react-native/no-inline-styles */
/* eslint-disable max-len */
import React, {  } from "react";
import {StyleSheet, View } from "react-native";
import { TakePictureResponse } from "react-native-camera";
import { Appbar } from "react-native-paper";
import { AppbarHeader } from "../Themed";
import { Hold, WallPicture } from "../walls/WallComponents";
import WallView from "../walls/WallView";

type CameraPreviewProps = {
    photo: WallPicture;
    holds: Hold[];
    retakePictureAction: () => void;
    confirmPictureAction: () => void;
}

const CameraPreview = (props: CameraPreviewProps): JSX.Element => {
    return (
        <View style={styles.previewContainer}>
            <AppbarHeader>
                <Appbar.Action icon="close" onPress={props.retakePictureAction} />
                <Appbar.Content title={"Successfully digitized wall"}/>
                <Appbar.Action icon={"content-save"} onPress={props.confirmPictureAction} />
            </AppbarHeader>
            <WallView photo={props.photo} holds={props.holds}/>
        </View>);
};

export default CameraPreview;

const styles = StyleSheet.create({
    previewContainer: {
        flexDirection: "column",
        backgroundColor: "transparent",
        justifyContent: "space-evenly",
        flexWrap: "nowrap",
        flex: 1,

    }
});
