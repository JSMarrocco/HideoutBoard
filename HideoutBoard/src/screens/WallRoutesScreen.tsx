/* eslint-disable max-len */
import { Guid } from "guid-typescript";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet } from "react-native";
import { Appbar, Card, Divider, IconButton } from "react-native-paper";
import ScrollableList from "../components/list/ScrollableList";
import AddRouteComponent from "../components/routes/AddRouteComponent";
import RouteRegister from "../components/routes/RouteRegister";
import RouteViewComponent from "../components/routes/RouteViewComponent";
import { AppbarHeader, View, Text } from "../components/Themed";
import { Hold, Route, routeDifficulty, Wall } from "../components/walls/WallComponents";
import WallView from "../components/walls/WallView";
import { WallsContext } from "../provider/WallsProvider";

type WallRoutesScreenProps = {
    wallId: string
    cancelAction: () => void;
}

const WallRoutesScreen = (props: WallRoutesScreenProps): JSX.Element => {

    const  {walls, setWalls} = useContext(WallsContext);
    const [windowWidth, SetWindowWidth] = useState<number>(0);
    const [isAddingRoute, SetIsAddingRoute] = useState<boolean>(false);
    const [isRegisteringRoute, setIsRegisteringRoute] = useState<boolean>(false);
    const [selectedRoute, setSelectedRoute] = useState<Route | undefined>(undefined);
    const [refreshing, setRefreshing] = React.useState(false);
    const [newRouteHold, setNewRouteHold] = useState<Hold[]>([]);
    const [currentWall, setCurrentWall] = useState<Wall>(new Wall());

    useEffect(() => {
        setCurrentWall(walls.find(w => w.id === props.wallId) || new Wall());
    }, []);

    const saveRoute = (routeName: string, difficulty: routeDifficulty) => {
        const newRoute: Route = {
            id: Guid.create().toString(),
            name: routeName,
            difficulty: difficulty,
            holds: newRouteHold
        };

        currentWall.routes.push(newRoute);
        setWalls(walls.filter(w => w.id !== props.wallId).concat(currentWall));

        setNewRouteHold([]);
        setIsRegisteringRoute(false);
        SetIsAddingRoute(false);
    };

    if (selectedRoute) {
        return (
            <RouteViewComponent
                route={selectedRoute}
                picture={currentWall.picture}
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
                wall={currentWall}
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


    const routes = (currentWall.routes.length > 0) ? currentWall.routes.map( (r:Route) => {
        return (
            <View  key={r.id}>
                <Card
                    onPress={ () =>  { setSelectedRoute(r);}}
                >
                    <Card.Title
                        title={r.name}
                        subtitle={r.difficulty}
                        right={(propss) => <IconButton {...propss} icon="trash-can-outline" onPress={ () => {
                            const index = currentWall.routes.indexOf(r, 0);
                            if (index > -1) {
                                currentWall.routes.splice(index, 1);
                            }
                            setWalls(walls.filter(w => w.id !== props.wallId).concat(currentWall));
                            setRefreshing(!refreshing);

                        }} />}
                    />
                </Card>
                <Divider />
            </View>
        );
    }) :  (
        <View style={styles.emptyContainer} >
            <Text style={styles.emptyText}>You haven't created any route yet!</Text>
        </View> );

    return (
        <View>
            <AppbarHeader>
                <Appbar.Action icon="arrow-left" onPress={() => {props.cancelAction();}} />
                <Appbar.Content title={`Routes for ${currentWall.name}`}  />
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
                            source={{uri: walls.find(w => w.id === props.wallId)?.picture.uri}}>
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
