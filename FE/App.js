import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./components/context/AuthContext";
import { ThemeProvider } from "./components/context/ThemeContext";
import AppNavigation from "./navigation/appNavigation";

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <ThemeProvider>
                    <AppNavigation />
                </ThemeProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
