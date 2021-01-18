import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {  View } from "../Themed";
import { RNCamera as Camera, TakePictureResponse } from "react-native-camera";
import CameraPreview from "./CameraPreview";
import OpenCV from "../../NativeModules/OpenCV";
import { Hold } from "../walls/wall";

const CameraBox = (): JSX.Element => {
    const camera = useRef<Camera | null>();
    const [isPreview, setIsPreview] = useState(false);
    const [capturedImage, setCapturedImage] = useState<TakePictureResponse | null>(null);
    const [capturedHolds, setCapturedHolds] = useState<Hold[] | null>(null);

    const processWall = (imgBase64: string, imgUri: string) => {

        imgUri = imgUri.replace("file://", "");

        return OpenCV.processWall(imgBase64, imgUri, (err: string)=> {
            console.log(`[DEBUG - ERROR]: ${err}`);
        }, (res: string)=> {
            const holds: Hold[] = [];
            JSON.parse(res).forEach( (HoldPosition: number[]) => {
                holds.push({position : {x:HoldPosition[0], y:HoldPosition[1], w:HoldPosition[2], h:HoldPosition[3]}});
            });
            console.log(holds.length);
            console.log(holds[0]);

            setCapturedHolds(holds);

        } );
    };

    const takePicture = async () => {
        if (!camera.current) return;
        const options = { quality: 1., base64: true };
        const data = await camera.current.takePictureAsync(options);

        if (!data) return;

        camera.current.resumePreview();
        setIsPreview(true);
        setCapturedImage(data);

        if (!data.base64) return;
        // console.log(data.base64);

        processWall(data.base64, data.uri);

    };

    const retakePicture = () => {
        setCapturedImage(null);
        setCapturedHolds(null);
        setIsPreview(false);
    };


    return (isPreview && capturedImage && capturedHolds) ?
        (<CameraPreview photo={capturedImage} retakePictureAction={retakePicture} holds={capturedHolds} />) :
        (
            <View style={styles.container}>
                <Camera
                    ref={ref => { camera.current = ref;}}
                    style={styles.preview}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: "Permission to use camera",
                        message: "We need your permission to use your camera",
                        buttonPositive: "Ok",
                        buttonNegative: "Cancel",
                    }}
                >
                    <View style={styles.takePictureContainer}>
                        <TouchableOpacity onPress={takePicture} style={styles.circleButton}/>
                    </View>
                </Camera>
            </View>
        );
};

export default CameraBox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    preview: {
        position: "relative",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    takePictureContainer: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#fff",
        padding: 5,
        bottom: "2%",
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: "#fff"
    }
});
