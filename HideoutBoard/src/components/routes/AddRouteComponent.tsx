/* eslint-disable max-len */
import React, {  } from "react";
import { StyleSheet} from "react-native";
import { AppbarHeader, View } from "../Themed";
import { Hold, HoldType, Wall } from "../walls/WallComponents";
import { Appbar } from "react-native-paper";
import WallView from "../walls/WallView";

type AddRouteComponentProps = {
    wall: Wall
    cancelAction: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line no-unused-vars
    confirmAction: (...args: any[]) => void;
}

const AddRouteComponent = (props: AddRouteComponentProps): JSX.Element => {
    let copyHolds: Hold[] = [];
    copyHolds = copyHolds.concat(props.wall.holds.map(h => { return Object.assign({}, h); })); // Create deepcopy of hold


    return (
        <View style={styles.container}>
            <AppbarHeader>
                <Appbar.Action icon="close" onPress={() => {props.cancelAction();}} />
                <Appbar.Content title={"Route creation"}  />
                <Appbar.Action icon="arrow-right" onPress={() => {
                    const filterCopiedHolds = copyHolds.filter(h => h.type !== HoldType.neutral).map( (fh, i) => {
                        fh.id = i;
                        return fh;
                    });

                    props.confirmAction(filterCopiedHolds);
                }} />
            </AppbarHeader>
            <WallView photo={props.wall.picture} holds={copyHolds}  isCreatingRoute={true}/>
        </View>
    );
};

export default AddRouteComponent;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        backgroundColor: "transparent",
        justifyContent: "space-evenly",
        flexWrap: "nowrap",
        flex: 1,

    }
});
