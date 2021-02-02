/* eslint-disable react-native/no-inline-styles */
/* eslint-disable max-len */
import React, { useState } from "react";
import {ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { TakePictureResponse } from "react-native-camera";
import { Appbar } from "react-native-paper";
import { AppbarHeader } from "../Themed";
import { Hold } from "../walls/wall";

type CameraPreviewProps = {
    photo: TakePictureResponse;
    holds: Hold[];
    retakePictureAction: () => void;
    confirmPictureAction: () => void;
}

const CameraPreview = (props: CameraPreviewProps): JSX.Element => {

    const [imgElementWidth, SetImgElementWidth] = useState<number>(0);
    const [imgElementHeight, SetImgElementHeight] = useState<number>(0);
    const [windowWidth, SetWindowWidth] = useState<number>(0);

    const holdsButton = props.holds.map( (holdInfo: Hold) =>  {
        return (
            <TouchableOpacity style={{
                width: (imgElementWidth * (holdInfo.position.w)/props.photo.height),
                height:  (imgElementHeight * (holdInfo.position.h)/props.photo.width),
                backgroundColor: "transparent",
                borderColor:"rgba(255, 255, 255, .8)",
                borderWidth: 2,
                borderRadius: 5,
                position: "absolute",
                left: imgElementWidth * holdInfo.position.x / (props.photo.height),
                top :  imgElementHeight * holdInfo.position.y / (props.photo.width)

            }} />
        );});

    return (
        <View style={styles.previewContainer}>

            <AppbarHeader>
                <Appbar.Action icon="close" onPress={props.retakePictureAction} />
                <Appbar.Content />
                <Appbar.Action icon={"arrow-right"} onPress={props.confirmPictureAction} />
            </AppbarHeader>
            <View  style={styles.photoContainer}onLayout={(event) => {
                SetWindowWidth(event.nativeEvent.layout.width);
            }}>
                <ImageBackground style={ {width: windowWidth, height: windowWidth * (4/3)  }} source={{uri: props.photo && props.photo.uri}} onLayout={(event) => {
                    SetImgElementWidth(event.nativeEvent.layout.width);
                    SetImgElementHeight(event.nativeEvent.layout.height);
                }}>
                    {holdsButton}
                </ImageBackground>
            </View>
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

    },
    photoContainer: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: "2%",
        marginTop: "2%",
        // width: "100%"
    }

});
