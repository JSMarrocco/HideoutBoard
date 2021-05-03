/* eslint-disable max-len */
import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { useCanvas } from "../../hooks/userCanvas";
import { View } from "../Themed";
import { Hold, HoldType, WallPicture } from "./WallComponents";
import Canvas from "react-native-canvas";
import { Guid } from "guid-typescript";

type CameraPreviewProps = {
    photo: WallPicture;
    holds: Hold[];
    isCreatingRoute? : boolean
}

const WallView = (props: CameraPreviewProps): JSX.Element => {
    const [imgElementWidth, SetImgElementWidth] = useState<number>(0);
    const [imgElementHeight, SetImgElementHeight] = useState<number>(0);
    const [windowWidth, SetWindowWidth] = useState<number>(0);
    const [ SetImageDim, setCanvasWidth, setCanvasHolds, updateHoldStroke, canvasRef ] = useCanvas();

    const holdsButton = props.holds.map( (holdInfo: Hold) =>  {
        const buttonWith = 20;
        const componentKey = Guid.create().toString();

        return (
            // eslint-disable-next-line react-native/no-inline-styles
            <TouchableOpacity key={componentKey} style={{
                width: buttonWith, // (imgElementWidth * (holdInfo.box.w)/props.photo.height),
                height: buttonWith, //  (imgElementHeight * (holdInfo.box.h)/props.photo.width),
                backgroundColor: "transparent",
                borderRadius: 50,
                position: "absolute",
                zIndex: 100,
                left: (imgElementWidth *  ( (holdInfo.box.x +   (holdInfo.box.w / 2 )) / props.photo.height )) - (buttonWith / 2),
                top :  (imgElementHeight * ( (holdInfo.box.y +   (holdInfo.box.h / 2 )) / props.photo.width )) - (buttonWith / 2),

            }}
            onPress={ () => {
                if (!props.isCreatingRoute) return;
                switch (holdInfo.type) {
                case HoldType.top:
                    holdInfo.type = HoldType.neutral;
                    break;
                case HoldType.foot:
                    holdInfo.type = HoldType.start;
                    break;
                case HoldType.hand:
                    holdInfo.type = HoldType.foot;
                    break;
                case HoldType.start:
                    holdInfo.type = HoldType.top;
                    break;
                case HoldType.neutral:
                default:
                    holdInfo.type = HoldType.hand;
                    break;
                }

                updateHoldStroke(holdInfo);

            }}
            />
        );});

    useEffect(() => {
        SetImageDim({width: props.photo.width, height: props.photo.height});
        setCanvasWidth(imgElementWidth);
        setCanvasHolds(props.holds);
    }, [imgElementWidth]);

    return (
        <View  style={styles.photoContainer} onLayout={(event) => {
            SetWindowWidth(event.nativeEvent.layout.width);
        }}>
            <ImageBackground style={ {width: windowWidth, height: windowWidth * (4/3)  }}
                source={{uri: props.photo && props.photo.uri}} onLayout={(event) => {
                    SetImgElementWidth(event.nativeEvent.layout.width);
                    SetImgElementHeight(event.nativeEvent.layout.height);
                }}>
            </ImageBackground>
            <Canvas
                style={styles.canvas}
                ref={canvasRef}
            />
            {holdsButton}

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
