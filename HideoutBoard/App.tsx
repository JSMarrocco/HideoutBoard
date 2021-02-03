import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Navigation from "./src/navigation";
import { WallsProvider } from "./src/provider/WallsProvider";


export default function App(): JSX.Element | null {
    // const isLoadingComplete = useCachedResources();

    const colorScheme = useColorScheme();

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <WallsProvider>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                </WallsProvider>
            </SafeAreaProvider>
        </PaperProvider>

    );
}
