import React from "react";
import { StyleSheet} from "react-native";
import { Appbar } from "react-native-paper";
import { AppbarHeader, Button, TextInput, View } from "../Themed";

type WallRegisterProps = {
    cancelAction: () => void;
    confirmAction: (...args: any[]) => void;
}

const WallRegister = (props: WallRegisterProps): JSX.Element => {
    const [wallName, setWallName] = React.useState("");
    const [wallDescription, setWallDescription] = React.useState("");

    return (
        <View style={styles.container}>
            <AppbarHeader>
                <Appbar.Action icon="arrow-left" onPress={props.cancelAction} />
            </AppbarHeader>
            <View style={styles.formContainer}>
                <TextInput
                    label="Name"
                    value={wallName}
                    onChangeText={ (input:string) => setWallName(input)}
                />
                <TextInput
                    style={styles.formItem}
                    label="Description (optional)"
                    value={wallDescription}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={ (input:string) => setWallDescription(input)}
                />
                <Button
                    style={styles.formItem}
                    mode="contained"
                    disabled= {wallName === "" || undefined}
                    onPress={() => props.confirmAction(wallName, wallDescription)}
                >Save</Button>
            </View>
        </View>
    );
};

export default WallRegister;

const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    formContainer : {
        flex: 1,
        marginHorizontal: "2%"
    },
    formItem :{
        marginBottom: "10%",
    }

});
