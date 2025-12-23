import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userEmail: null,
        token: null,
    });

    // Load auth state khi khởi động app
    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const email = await AsyncStorage.getItem("userEmail");

                if (token && email) {
                    setAuthState({
                        isLoggedIn: true,
                        userEmail: email,
                        token: token,
                    });
                }
            } catch (error) {
                console.error("Error loading auth state:", error);
            }
        };

        loadAuthState();
    }, []);

    const login = async (email, token) => {
        try {
            await AsyncStorage.multiSet([
                ["token", token],
                ["userEmail", email],
            ]);

            setAuthState({
                isLoggedIn: true,
                userEmail: email,
                token: token,
            });
        } catch (error) {
            console.error("Error saving auth data:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(["token", "userEmail"]);
            setAuthState({
                isLoggedIn: false,
                userEmail: null,
                token: null,
            });
        } catch (error) {
            console.error("Error clearing auth data:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: authState.isLoggedIn,
                userEmail: authState.userEmail,
                token: authState.token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
