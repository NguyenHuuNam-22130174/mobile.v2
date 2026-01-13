import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUnauthorizedHandler } from "../../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userEmail: null,
        token: null,
    });

    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                const email = await AsyncStorage.getItem("userEmail");

                if (token && email) {
                    setAuthState({
                        isLoggedIn: true,
                        userEmail: email,
                        token,
                    });
                }
            } catch (error) {
                console.error("Error loading auth state:", error);
            } finally {
                setIsLoading(false); // 🔥 QUAN TRỌNG
            }
        };

        loadAuthState();
    }, []);

    const login = async (email, token) => {
        await AsyncStorage.multiSet([
            ["token", token],
            ["userEmail", email],
        ]);

        setAuthState({
            isLoggedIn: true,
            userEmail: email,
            token,
        });
    };

    const logout = useCallback(async () => {
        await AsyncStorage.multiRemove(["token", "userEmail"]);

        setAuthState({
            isLoggedIn: false,
            userEmail: null,
            token: null,
        });
    }, []);

    // đăng ký hàm logout để API gọi khi 401
    useEffect(() => {
        setUnauthorizedHandler(logout);
        return () => setUnauthorizedHandler(null);
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: authState.isLoggedIn,
                userEmail: authState.userEmail,
                token: authState.token,
                isLoading,   
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
