import React, { useContext, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity} from "react-native";
import Toast from "react-native-easy-toast";
import { Text, View } from "../components/Themed";
import { RNCamera as Camera, TakePictureResponse } from "react-native-camera";
import { Hold, Wall } from "../components/walls/WallComponents";
import OpenCV from "../NativeModules/OpenCV";
import { deleteFile, readFile, writeFile } from "../helpers/FileManaging";
import { Guid } from "guid-typescript";
import { WALLS_DATA_FILE_NAME } from "../constants/Constants";
import CameraPreview from "../components/scanWall/CameraPreview";
import WallRegister from "../components/scanWall/wallRegister";
import { orangeColor } from "../constants/Colors";
import { WallsContext } from "../provider/WallsProvider";

enum BoxState {
    camera,
    preview,
    register,
  }

const ScanWallScreen = (): JSX.Element => {
    const camera = useRef<Camera | null>();
    const errorToast = useRef<Toast | null>();
    const goodToast = useRef<Toast | null>();

    const [boxState, setBoxState] = useState<BoxState>(BoxState.camera);
    const [isScaning, setIsScaning] = useState(false);
    const [capturedImage, setCapturedImage] = useState<TakePictureResponse | null>(null);
    const [capturedHolds, setCapturedHolds] = useState<Hold[] | null>(null);

    const  {walls, setWalls} = useContext(WallsContext);


    const processWall = (imgBase64: string, imgUri: string) => {

        imgUri = imgUri.replace("file://", "");

        return OpenCV.processWall(imgBase64, imgUri, (err: string)=> {
            console.log(`[DEBUG - ERROR]: ${err}`);
            if (errorToast.current) {
                errorToast.current.show("Something wrong happened during processing", 1000);
            }

            setIsScaning(false);

        }, (HoldsBoxes: string, HoldsContours:string ) => {
            const holds: Hold[] = [];

            const contours: [[{x: number; y:number}]]  = JSON.parse(HoldsContours);
            const box: [[number]] = JSON.parse(HoldsBoxes);

            console.log(`${contours.length} contours / ${box.length} holds`);


            for (let i = 0; i < box.length; i++) {
                holds.push({
                    contour: contours[i],
                    box: {x: box[i][0], y: box[i][1], w: box[i][2], h: box[i][3]}
                });
            }


            setIsScaning(false);
            setCapturedHolds(holds);
        } );
    };

    const takePicture = async () => {
        readFile("TestFile");

        setIsScaning(true);

        if (!camera.current) return;
        const options = { quality: 1., base64: true, pauseAfterCapture: true};
        const data = await camera.current.takePictureAsync(options);

        if (!data) return;

        camera.current.resumePreview();
        setBoxState(BoxState.preview);
        setCapturedImage(data);

        if (!data.base64) return;

        processWall(data.base64, data.uri);

    };

    const retakePicture = () => {
        if (capturedImage) deleteFile(capturedImage.uri);

        setCapturedImage(null);
        setCapturedHolds(null);
        setBoxState(BoxState.camera);
    };

    const saveWall = (name: string, description: string) => {

        if(!capturedHolds || !capturedImage) return;

        const newWall: Wall = {
            id: Guid.create().toString(),
            name: name,
            description: description,
            holds: capturedHolds,
            imageUri: capturedImage.uri
        };

        setWalls(walls.concat(newWall));

        writeFile(WALLS_DATA_FILE_NAME, JSON.stringify(walls))
            .then( res =>  console.log("New Wall Added"))
            .catch( (err) => console.error(err));

        setCapturedImage(null);
        setCapturedHolds(null);
        setBoxState(BoxState.camera);

    };


    if (boxState==BoxState.preview && capturedImage && capturedHolds) {
        return (<CameraPreview
            photo={capturedImage}
            holds={capturedHolds}
            retakePictureAction={retakePicture}
            confirmPictureAction = {() => { setBoxState(BoxState.register);}} />);
    }

    if (boxState==BoxState.register) {
        return (<WallRegister
            cancelAction={() => {setBoxState(BoxState.preview);}}
            confirmAction={saveWall}
        />);
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={ref => { camera.current = ref;}}
                style={styles.camera}
                captureAudio={false}
                androidCameraPermissionOptions={{
                    title: "Permission to use camera",
                    message: "We need your permission to use your camera",
                    buttonPositive: "Ok",
                    buttonNegative: "Cancel",
                }}
            >

                {!isScaning ?
                    <View style={styles.takePictureContainer}>
                        <TouchableOpacity onPress={takePicture} style={styles.circleButton}/>
                    </View> : (<View style={styles.loader}><ActivityIndicator size={60}  color={orangeColor}  /></View>)
                }
            </Camera>
            <Toast  ref={ref => {errorToast.current = ref;}} position='top' style={styles.errorToaster} opacity={0.8} positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}/>
            <Toast  ref={ref => {goodToast.current = ref;}} position='center' style={styles.goodToaster} opacity={0.8} positionValue={200}
                fadeInDuration={750}
                fadeOutDuration={1000}/>
        </View>

    );
};

export default ScanWallScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    camera: {
        position: "relative",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    takePictureContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#fff",
        padding: 5,
        bottom: "2%",
    },
    loader: {
        alignSelf: "center",
        backgroundColor: "transparent",
        alignItems: "center",
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: "#fff"
    },
    errorToaster: {
        backgroundColor: "#f01f3b",
    },
    goodToaster: {
        backgroundColor: orangeColor,
    }

});
