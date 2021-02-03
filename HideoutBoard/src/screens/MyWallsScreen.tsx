import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity} from "react-native";
import ListTile from "../components/list/ListTile";
import ScrollableList from "../components/list/ScrollableList";
import { Text, TextInput, View } from "../components/Themed";
import { Wall } from "../components/walls/WallComponents";
import { WALLS_DATA_FILE_NAME } from "../constants/Constants";
import { deleteFile } from "../helpers/FileManaging";
import { TextInput as DefaultTextInput} from "react-native-paper";


import * as RNFS from "react-native-fs";
import { WallsContext } from "../provider/WallsProvider";
import ClimbingIcon from "../../assets/svg/climbingIcon";
import  Icon  from "react-native-vector-icons/FontAwesome";
// import Icon from "react-native-vector-icons/Feather";


const MyWallsScreen = (): JSX.Element => {

    const  {walls, setWalls} = useContext(WallsContext);

    const wallTiles = walls.map((wall: Wall) => {
        const description = (!wall.description || wall.description === "") ? <></>:  <Text style={styles.descriptionText}>{wall.description}</Text>;

        return (
            <TouchableOpacity onPress={() => {
                deleteFile(`file://${RNFS.DocumentDirectoryPath}/${WALLS_DATA_FILE_NAME}`);
                setWalls([]);
            }}>
                <ListTile>
                    <Text style={styles.tileText}>{wall.name}</Text>
                    {description}
                </ListTile>
            </TouchableOpacity>
        );
    });

    if (wallTiles.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <ClimbingIcon color={"#FFF"}  size={"30%"} />
                <Text style={styles.emptyText}>You haven't created any walls yet!</Text>
            </View>
        );
    }

    return (
        <ScrollableList>
            <TextInput
                label="Search"
                value={""}
                left={
                    <DefaultTextInput.Icon name={() => <Icon name={"search"}  color={"#FFF"} size={22}/>} />
                }
            />
            {wallTiles}
        </ScrollableList>
    );
};

export default MyWallsScreen;

const styles = StyleSheet.create({
    tileText: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#FFFF"
    },
    descriptionText: {
        color: "#FFFF"
    },
    emptyContainer: {
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        fontWeight: "bold",
        fontSize: 20,
    }
});
