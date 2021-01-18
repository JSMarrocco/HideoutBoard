/* eslint-disable max-len */
import React, { useState } from "react";
import { Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { TakePictureResponse } from "react-native-camera";
import Icon from "react-native-vector-icons/Feather";
import ClimbingIcon from "../../../assets/svg/climbingIcon";
import { Hold } from "../walls/wall";

type CameraPreviewProps = {
    photo: TakePictureResponse;
    holds: Hold[];
    retakePictureAction: () => void;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CameraPreview = (props: CameraPreviewProps): JSX.Element => {

    const [imgElementWidth, SetImgElementWidth] = useState<number>(windowWidth);
    const [imgElementHeight, SetImgElementHeight] = useState<number>(windowHeight);


    console.log("LOG:");

    console.log(windowWidth, windowHeight);
    console.log(props.photo.width, props.photo.height);



    const holdsButton = props.holds.map( (holdInfo: Hold) =>  {
        // imgElementWidth/imgElementHeight

        const w = (imgElementWidth/imgElementHeight); // / (props.photo.height/props.photo.width);
        const x = imgElementWidth * holdInfo.position.x / (props.photo.height) ;
        const y = imgElementHeight * holdInfo.position.y / (props.photo.width)  ;


        return (
        // eslint-disable-next-line react-native/no-inline-styles
            <TouchableOpacity style={{
                // width: 10,
                // height:  10,
                // borderRadius: 50,
                // backgroundColor: "#f50000",
                width: (411 * (holdInfo.position.w)/props.photo.height),
                height:  (666.6 * (holdInfo.position.h)/props.photo.width),
                backgroundColor: "transparent",
                borderColor:"#f50000",
                borderWidth: 3,

                position: "absolute",
                left: imgElementWidth * holdInfo.position.x / (props.photo.height) ,
                top :  imgElementHeight * holdInfo.position.y / (props.photo.width)

            }} />
        );});

    return (
        <View style={styles.photoContainer}>
            <ImageBackground style={styles.photo} source={{uri: props.photo && props.photo.uri}} onLayout={(event) => {
                SetImgElementWidth(event.nativeEvent.layout.width);
                SetImgElementHeight(event.nativeEvent.layout.height);
            }}>

                {holdsButton}

            </ImageBackground>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={props.retakePictureAction} style={styles.retakeButton}>
                    <Icon size={50}  name="trash-2" color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={props.retakePictureAction} style={styles.saveButton} >
                    <ClimbingIcon color="white"/>
                </TouchableOpacity>
            </View>
        </View>);
};

export default CameraPreview;

const styles = StyleSheet.create({
    photoContainer: {
        flexDirection: "row",
        backgroundColor: "transparent",
        justifyContent: "space-between",
        flex: 1,
        width: "100%",
        height: "100%",
    },
    photo: {
        flex: 1,
        width: windowWidth,
        height: windowWidth * (4/3),
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
