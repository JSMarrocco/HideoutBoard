import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { TakePictureResponse } from "react-native-camera";
import Icon from "react-native-vector-icons/Feather";
import ClimbingIcon from "../../../assets/svg/climbingIcon";

type CameraPreviewProps = {
    photo: TakePictureResponse;
    retakePictureAction: () => void;
}

const CameraPreview = (props: CameraPreviewProps): JSX.Element => {
    return (
        <View style={styles.photoContainer}>
            <ImageBackground style={styles.photo} source={{uri: props.photo && props.photo.uri}}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={props.retakePictureAction} style={styles.retakeButton}>
                        <Icon size={50}  name="trash-2" color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.retakePictureAction} style={styles.saveButton} >
                        <ClimbingIcon color="white"/>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default CameraPreview;

const styles = StyleSheet.create({
    photoContainer: {
        flexDirection: "row",
        backgroundColor: "transparent",
        justifyContent: "space-between",
        flex: 1,
        width: "100%",
        height: "100%"
    },
    photo: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-end",
        backgroundColor: "transparent",
    },
    retakeButton: {
        bottom: "2%",
        width: 50,
        height: 50,
    },
    saveButton: {
        bottom: "2%",
        width: 50,
        height: 50,
    },
});
