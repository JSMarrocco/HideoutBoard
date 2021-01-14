import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {  View } from "../Themed";
import { RNCamera as Camera, TakePictureResponse } from "react-native-camera";
import CameraPreview from "./CameraPreview";

const CameraBox = (): JSX.Element => {
    const camera = useRef<Camera | null>();
    const [isPreview, setIsPreview] = useState(false);
    const [capturedImage, setCapturedImage] = useState<any>(null);


    const takePicture = async () => {
        if (!camera.current) return;
        const options = { quality: 0.5, base64: true };
        const data = await camera.current.takePictureAsync(options);

        if (!data) return;

        setIsPreview(true);
        setCapturedImage(data);
        camera.current.resumePreview();
    };

    const retakePicture = () => {
        setCapturedImage(null);
        setIsPreview(false);
    };


    return (isPreview) ?
        (<CameraPreview photo={capturedImage} retakePictureAction={retakePicture}/>) :
        (
            <View style={styles.container}>
                <Camera
                    ref={ref => { camera.current = ref;}}
                    style={styles.preview}
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
