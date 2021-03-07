/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { TakePictureResponse } from "react-native-camera";
import { useCanvas } from "../../hooks/userCanvas";
import { View } from "../Themed";
import { Hold } from "./WallComponents";
import Canvas from "react-native-canvas";


type CameraPreviewProps = {
    photo: TakePictureResponse;
    holds: Hold[];
}

const WallView = (props: CameraPreviewProps): JSX.Element => {
    const [imgElementWidth, SetImgElementWidth] = useState<number>(0);
    const [imgElementHeight, SetImgElementHeight] = useState<number>(0);
    const [windowWidth, SetWindowWidth] = useState<number>(0);
    const [ SetImageDim, setCanvasWidth, setCanvasHolds, canvasRef ] = useCanvas();

    const holdsButton = props.holds.map( (holdInfo: Hold) =>  {
        const buttonWith = 20;
        return (
            // eslint-disable-next-line react-native/no-inline-styles
            <TouchableOpacity style={{
                width: buttonWith, // (imgElementWidth * (holdInfo.box.w)/props.photo.height),
                height: buttonWith, //  (imgElementHeight * (holdInfo.box.h)/props.photo.width),
                backgroundColor: "transparent",
                borderRadius: 50,
                position: "absolute",
                left: (imgElementWidth *  ( (holdInfo.box.x +   (holdInfo.box.w / 2 )) / props.photo.height )) - (buttonWith / 2),
                top :  (imgElementHeight * ( (holdInfo.box.y +   (holdInfo.box.h / 2 )) / props.photo.width )) - (buttonWith / 2),

            }} />
        );});

    useEffect(() => {
        SetImageDim({width: props.photo.width, height: props.photo.height});
        setCanvasWidth(imgElementWidth);
        setCanvasHolds(props.holds);
    }, [imgElementWidth]);

    return (
        <View  style={styles.photoContainer}onLayout={(event) => {
            SetWindowWidth(event.nativeEvent.layout.width);
        }}>
            <ImageBackground style={ {width: windowWidth, height: windowWidth * (4/3)  }}
                source={{uri: props.photo && props.photo.uri}} onLayout={(event) => {
                    SetImgElementWidth(event.nativeEvent.layout.width);
                    SetImgElementHeight(event.nativeEvent.layout.height);
                }}>
                {holdsButton}
            </ImageBackground>
            <Canvas
                style={styles.canvas}
                ref={canvasRef}
            />
        </View>
    );
};

export default WallView;

const styles = StyleSheet.create({
    photoContainer: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: "2%",
        marginTop: "2%",
    },
    canvas: {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        zIndex: 8,
    }
});
