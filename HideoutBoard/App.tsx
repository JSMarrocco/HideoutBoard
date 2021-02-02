import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";


import Navigation from "./src/navigation";

export default function App(): JSX.Element | null {
    // const isLoadingComplete = useCachedResources();

    const colorScheme = useColorScheme();

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </SafeAreaProvider>
        </PaperProvider>

    );
}
