// import React, { useContext } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { View, ActivityIndicator, StyleSheet } from "react-native";
// import { AuthContext } from "../components/context/AuthContext";
// import MovieScreen from "../screens/MovieScreen";
// import PersonScreen from "../screens/PersonScreen";
// import SearchScreen from "../screens/SearchScreen";
// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
// import TrailerScreen from "../screens/TrailerScreen";
// import UpcomingScreen from "../screens/UpcomingScreen";
// import TopRatedScreen from "../screens/TopRatedScreen";

// import DrawerNavigator from "./DrawerNavigator";

// const Stack = createNativeStackNavigator();

// const LoadingIndicator = () => (
//     <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#ef4444" />
//     </View>
// );

// export default function AppNavigation() {
//     const { isLoggedIn, isLoading } = useContext(AuthContext);

//     if (isLoading) {
//         return <LoadingIndicator />;
//     }

//     return (
//         <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//                 {isLoggedIn ? (
//                     <>
//                         <Stack.Screen
//                             name="MainApp"
//                             component={DrawerNavigator}
//                         />
//                         <Stack.Screen
//                             name="Movie"
//                             component={MovieScreen}
//                             options={{ animation: "slide_from_right" }}
//                         />
//                         <Stack.Screen
//                             name="Person"
//                             component={PersonScreen}
//                             options={{ animation: "slide_from_right" }}
//                         />
//                         <Stack.Screen
//                             name="Search"
//                             component={SearchScreen}
//                             options={{ animation: "slide_from_bottom" }}
//                         />
//                         <Stack.Screen
//                             name="Trailer"
//                             component={TrailerScreen}
//                             options={{ animation: "fade" }}
//                         />
//                         <Stack.Screen
//                             name="Upcoming"
//                             component={UpcomingScreen}
//                             options={{ animation: "slide_from_right" }}
//                         />
//                         <Stack.Screen
//                             name="TopRated"
//                             component={TopRatedScreen}
//                             options={{ animation: "slide_from_right" }}
//                         />
//                     </>
//                 ) : (
//                     <>
//                         <Stack.Screen
//                             name="Login"
//                             component={LoginScreen}
//                             options={{ animation: "fade" }}
//                         />
//                         <Stack.Screen
//                             name="Register"
//                             component={RegisterScreen}
//                             options={{ animation: "slide_from_right" }}
//                         />
//                     </>
//                 )}
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }

// const styles = StyleSheet.create({
//     loadingContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#0f172a",
//     },
// });
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "../components/context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MovieScreen from "../screens/MovieScreen";

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
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen
                        name="Movie"
                        component={MovieScreen}
                        options={{ animation: "slide_from_right" }}
                    />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}

