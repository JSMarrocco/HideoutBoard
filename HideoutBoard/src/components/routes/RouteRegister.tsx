import React from "react";
import { StyleSheet} from "react-native";
import { Appbar } from "react-native-paper";
import { AppbarHeader, Button, DropDownMenu, TextInput, View } from "../Themed";
import { HoldType, routeDifficulty } from "../walls/WallComponents";


type WallRegisterProps = {
    cancelAction: () => void;
    confirmAction: (...args: any[]) => void;
}

const RouteRegister = (props: WallRegisterProps): JSX.Element => {
    const [routeName, setRouteName] = React.useState("");
    const [difficulty, setDifficulty] = React.useState<routeDifficulty>("V0");
    const [refreshing, setRefreshing] = React.useState(false);


    return (
        <View style={styles.container}>
            <AppbarHeader>
                <Appbar.Action icon="arrow-left" onPress={props.cancelAction} />
            </AppbarHeader>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.formItem}
                    label="Name"
                    value={routeName}
                    onChangeText={ (input:string) => setRouteName(input)}
                />
                <DropDownMenu
                    items={[
                        {label: 'V0', value: 'V0'},
                        {label: 'V1', value: 'V1'},
                        {label: 'V2', value: 'V2'},
                        {label: 'V3', value: 'V3'},
                        {label: 'V4', value: 'V4'},
                        {label: 'V5', value: 'V5'},
                        {label: 'V6', value: 'V6'},
                        {label: 'V7', value: 'V7'},
                        {label: 'V8', value: 'V8'},
                        {label: 'V9', value: 'V9'},
                        {label: 'V10', value: 'V10'},
                        {label: 'V11', value: 'V11'},
                        {label: 'V12', value: 'V12'},
                    ]}
                    defaultValue={difficulty}
                    containerStyle={[{height: 40, }, styles.formItem]}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    onChangeItem={item => setDifficulty(item.value)}
                    onOpen={() => {styles.formButton = {marginTop: 150}; setRefreshing(!refreshing);}}
                    onClose={() => {styles.formButton = {marginTop: 0}; setRefreshing(!refreshing);}}

                />
                <Button
                    style={[styles.formItem, styles.formButton]}
                    mode="contained"
                    disabled= {routeName === "" || undefined}
                    onPress={() => props.confirmAction(routeName, difficulty)}
                >Save</Button>
            </View>
        </View>
    );
};

export default RouteRegister;

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
    },
    formButton : {
    }

});
