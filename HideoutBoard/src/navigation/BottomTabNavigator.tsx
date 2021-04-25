// import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather";
import * as React from "react";
import { StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import TabOneScreen from "../screens/TabOneScreen";
import { ScanWallParamList, BottomTabParamList, TabOneParamList, MyWallsParamList as MyBoardsParamList, } from "./types";
import ScanWallScreen from "../screens/ScanWallScreen";
import MyWallsScreen from "../screens/MyWallsScreen";
import ClimbingIcon from "../../assets/svg/climbingIcon";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator(): JSX.Element {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="TabOne"
            tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
            {/* <BottomTab.Screen
                name="TabOne"
                component={TabOneNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="help-circle" color={color} />,
                }}
            /> */}
            <BottomTab.Screen
                name="MyBoards"
                component={MyWallsNavigator}
                options={{
                    tabBarIcon: ({ color }) => <ClimbingIcon color={color}  size={30} />,
                }}
            />
            <BottomTab.Screen
                name="ScanWall"
                component={ScanWallNavigator}
                options={{
                    tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
                }}
            />
        </BottomTab.Navigator>
    );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
    return <Icon size={30} style={styles.icon} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
    return (
        <TabOneStack.Navigator>
            <TabOneStack.Screen
                name="TabOneScreen"
                component={TabOneScreen}
                options={{ headerTitle: "Tab One Title" }}
            />
        </TabOneStack.Navigator>
    );
}

const ScanWallStack = createStackNavigator<ScanWallParamList>();

function ScanWallNavigator() {
    return (
        <ScanWallStack.Navigator>
            <ScanWallStack.Screen
                name="ScanWallScreen"
                component={ScanWallScreen}
                options={{ headerTitle: "Create new Hideout Board" }}
            />
        </ScanWallStack.Navigator>
    );
}

const MyBoardsStack = createStackNavigator<MyBoardsParamList>();

function MyWallsNavigator() {
    return (
        <MyBoardsStack.Navigator>
            <MyBoardsStack.Screen
                name="MyBoardsScreen"
                component={MyWallsScreen}
                options={{ headerTitle: "Hideout Boards" }}
            />
        </MyBoardsStack.Navigator>
    );
}

const styles = StyleSheet.create({
    icon: { marginBottom: -3 }
});
