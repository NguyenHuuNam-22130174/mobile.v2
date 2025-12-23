import React, { createContext, useState, useEffect, useContext } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Lấy theme mặc định từ hệ thống
    const colorScheme = Appearance.getColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
    const [theme, setTheme] = useState({});

    // Cập nhật theme khi isDarkMode thay đổi
    useEffect(() => {
        setTheme(isDarkMode ? lightTheme : darkTheme);
    }, [isDarkMode]);

    // Lắng nghe thay đổi theme từ hệ thống
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setIsDarkMode(colorScheme === "dark");
        });

        return () => subscription.remove();
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Định nghĩa các theme
const lightTheme = {
    colors: {
        primary: "#ef4444", // red-500
        background: "#ffffff", // white
        card: "#f8fafc", // slate-50
        text: "#0f172a", // slate-900
        border: "#e2e8f0", // slate-200
        notification: "#ef4444", // red-500
        secondary: "#64748b", // slate-500
        accent: "#f43f5e", // rose-500
        success: "#10b981", // emerald-500
        warning: "#f59e0b", // amber-500
        error: "#ef4444", // red-500
    },
    fonts: {
        regular: "Inter-Regular",
        medium: "Inter-Medium",
        bold: "Inter-Bold",
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

const darkTheme = {
    colors: {
        primary: "#ef4444", // red-500
        background: "#0f172a", // slate-900
        card: "#1e293b", // slate-800
        text: "#f8fafc", // slate-50
        border: "#334155", // slate-700
        notification: "#ef4444", // red-500
        secondary: "#94a3b8", // slate-400
        accent: "#fb7185", // rose-400
        success: "#34d399", // emerald-400
        warning: "#fbbf24", // amber-400
        error: "#f87171", // red-400
    },
    fonts: {
        regular: "Inter-Regular",
        medium: "Inter-Medium",
        bold: "Inter-Bold",
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

// Hook tiện ích để sử dụng theme
export const useTheme = () => useContext(ThemeContext);
