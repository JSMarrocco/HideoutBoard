/* eslint-disable max-len */
import { Guid } from "guid-typescript";
import React, { useState } from "react";
import { ImageBackground, ScrollView, StyleSheet } from "react-native";
import { Appbar, Card, Divider, IconButton } from "react-native-paper";
import ScrollableList from "../components/list/ScrollableList";
import AddRouteComponent from "../components/routes/AddRouteComponent";
import RouteRegister from "../components/routes/RouteRegister";
import RouteViewComponent from "../components/routes/RouteViewComponent";
import { AppbarHeader, View, Text } from "../components/Themed";
import { Hold, Route, routeDifficulty, Wall } from "../components/walls/WallComponents";
import WallView from "../components/walls/WallView";

type WallRoutesScreenProps = {
    wall: Wall
    cancelAction: () => void;
}

const WallRoutesScreen = (props: WallRoutesScreenProps): JSX.Element => {

    const [windowWidth, SetWindowWidth] = useState<number>(0);
    const [isAddingRoute, SetIsAddingRoute] = useState<boolean>(false);
    const [isRegisteringRoute, setIsRegisteringRoute] = useState<boolean>(false);
    const [selectedRoute, setSelectedRoute] = useState<Route | undefined>(undefined);
    const [refreshing, setRefreshing] = React.useState(false);
    const [newRouteHold, setNewRouteHold] = useState<Hold[]>([]);

    const saveRoute = (routeName: string, difficulty: routeDifficulty) => {
        const newRoute: Route = {
            key: Guid.create().toString(),
            name: routeName,
            difficulty: difficulty,
            holds: newRouteHold
        };

        props.wall.routes.push(newRoute);
        setNewRouteHold([]);
        setIsRegisteringRoute(false);
        SetIsAddingRoute(false);
    };

    if (selectedRoute) {
        return (
            <RouteViewComponent
                route={selectedRoute}
                picture={props.wall.picture}
                cancelAction={() => {
                    setSelectedRoute(undefined);
                } }
            />
        );
    }

    if(isRegisteringRoute) {
        return (
            <RouteRegister
                cancelAction={() => {
                    setNewRouteHold([]);
                    setIsRegisteringRoute(false);
                } }
                confirmAction={saveRoute}/>
        );
    }

    if (isAddingRoute) {

        return (
            <AddRouteComponent
                wall={props.wall}
                cancelAction={() => {
                    setNewRouteHold([]);
                    SetIsAddingRoute(false);
                }}
                confirmAction={(editedHold: Hold[]) => {
                    setNewRouteHold(editedHold);
                    setIsRegisteringRoute(true);
                }} />
        );
    }


    const routes = (props.wall.routes.length > 0) ? props.wall.routes.map( (r:Route) => {
        return (
            <View>
                <Card
                    onPress={ () =>  { setSelectedRoute(r);}}
                >
                    <Card.Title
                        title={r.name}
                        subtitle={r.difficulty}
                        right={(propss) => <IconButton {...propss} icon="trash-can-outline" onPress={ () => {
                            const index = props.wall.routes.indexOf(r, 0);
                            if (index > -1) {
                                props.wall.routes.splice(index, 1);
                            }
                            setRefreshing(!refreshing);

                        }} />}
                    />
                </Card>
                <Divider />
            </View>
        );
    }) :  (
        <View style={styles.emptyContainer} >
            <Text style={styles.emptyText}>You haven't created any routes yet!</Text>
        </View> );

    return (
        <View>
            <AppbarHeader>
                <Appbar.Action icon="arrow-left" onPress={() => {props.cancelAction();}} />
                <Appbar.Content title={`Routes for ${props.wall.name}`}  />
                <Appbar.Action icon="plus" onPress={() => SetIsAddingRoute(true)} />
            </AppbarHeader>
            <ScrollView style={styles.routeList}>
                <View style={styles.container}>
                    <View style={styles.wallView} onLayout={(event) => {
                        SetWindowWidth(event.nativeEvent.layout.width);
                    }}>
                        {/* <WallView photo={props.wall.picture} holds={props.wall.holds} /> */}
                        <ImageBackground
                            style={ {width: windowWidth, height:  windowWidth * (4/3)  }}
                            source={{uri: props.wall.picture.uri}}>
                        </ImageBackground>
                    </View>
                </View>
                {routes}
            </ScrollView>

        </View>
    );
};

export default WallRoutesScreen;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center"
    },
    wallView: {
        width: "50%",
    },
    routeList: {
        marginBottom: 100
    },
    emptyContainer: {
        marginTop: "20%",
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyText: {
        fontWeight: "bold",
        fontSize: 20,
    }
});
