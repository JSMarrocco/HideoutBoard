import React from "react";
import { StyleSheet} from "react-native";
import CameraBox from "../components/camera/CameraBox";
import { Text, View } from "../components/Themed";

const ScanWallScreen = (): JSX.Element => {
    return (
        <CameraBox></CameraBox>
    );
};

export default ScanWallScreen;

const styles = StyleSheet.create({});
