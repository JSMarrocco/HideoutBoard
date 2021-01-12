import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "./src/components/Themed";


import Navigation from "./src/navigation";

export default function App(): JSX.Element | null {
    // const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    return (
        <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
        </SafeAreaProvider>
    );
}
