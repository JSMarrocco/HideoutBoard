import React, { useContext, useState } from "react";
import { StyleSheet} from "react-native";
import ScrollableList from "../components/list/ScrollableList";
import { Searchbar, Text, View } from "../components/Themed";
import { Wall } from "../components/walls/WallComponents";
import { WALLS_DATA_FILE_NAME } from "../constants/Constants";
import { deleteFile } from "../helpers/FileManaging";
import { Card, Divider, IconButton  } from "react-native-paper";

import * as RNFS from "react-native-fs";
import { WallsContext } from "../provider/WallsProvider";
import ClimbingIcon from "../../assets/svg/climbingIcon";
import WallRoutesScreen from "./WallRoutesScreen";


const MyWallsScreen = (): JSX.Element => {

    const  {walls, setWalls} = useContext(WallsContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWallId, setSelectedWallId] = useState<string>("");

    const onChangeSearch = (query: string) => setSearchQuery(query);

    const deleteWall = (wall: Wall, setWalls: React.Dispatch<React.SetStateAction<Wall[]>>) => {
        deleteFile(`file://${RNFS.DocumentDirectoryPath}/${WALLS_DATA_FILE_NAME}`);
        deleteFile(wall.picture.uri);
        setWalls(walls.filter(w => w.id != wall.id));
    };

    const wallTiles = walls.filter( (wall: Wall) => wall.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()))
        .map((wall: Wall) => {
            const descriptionString = (!wall.description || wall.description === "") ? "No description":  wall.description;

            return (
                <View key={wall.id}>
                    <Card
                        onPress={ () =>  { setSelectedWallId(wall.id); }}
                    >
                        <Card.Cover source={{ uri: wall.picture.uri }} />
                        <Card.Title
                            title={wall.name}
                            subtitle={descriptionString}
                            right={(props) => <IconButton {...props} icon="trash-can-outline" onPress={ () => deleteWall(wall, setWalls)} />}
                        />
                    </Card>
                    <Divider />
                </View>
            );
        });

    if (walls.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <ClimbingIcon color={"#FFF"}  size={"30%"} />
                <Text style={styles.emptyText}>You haven't created any Hideout Board yet!</Text>
            </View>
        );
    }


    if (selectedWallId !== "") {
        return (<WallRoutesScreen wallId={selectedWallId} cancelAction={() => {setSelectedWallId("");}}/>);
    }

    return (
        <ScrollableList>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
            {wallTiles}
        </ScrollableList>
    );
};

export default MyWallsScreen;

const styles = StyleSheet.create({
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
