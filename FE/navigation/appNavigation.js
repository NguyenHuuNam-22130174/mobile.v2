import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "../components/context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";
import TrailerScreen from "../screens/TrailerScreen";
import DrawerNavigator from "./DrawerNavigator";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    // 🔥 CHẶN render khi auth chưa load xong
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
                    <Stack.Screen name="MainApp" component={DrawerNavigator} />
                    <Stack.Screen
                        name="Movie"
                        component={MovieScreen}
                        options={{ animation: "slide_from_right" }}
                    />
                    <Stack.Screen
                        name="Trailer"
                        component={TrailerScreen}
                        options={{ animation: "fade" }}
                    />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}

