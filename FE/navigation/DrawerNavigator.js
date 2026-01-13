import React, { useContext, useState, useRef, useEffect } from "react";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable,
    ActivityIndicator,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
    ArrowRightOnRectangleIcon,
    UserIcon,
    HomeIcon,
    HeartIcon,
    SunIcon,
    MoonIcon,
    ClockIcon,
    GiftTopIcon,
} from "react-native-heroicons/outline";
import HomeScreen from "../screens/HomeScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import UpcomingScreen from "../screens/UpcomingScreen";
import { AuthContext } from "../components/context/AuthContext";
import { useTheme } from "../components/context/ThemeContext";
import TopRatedScreen from "../screens/TopRatedScreen";
import { FilmIcon } from "react-native-heroicons/solid";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
    const { isLoggedIn, userEmail, logout } = useContext(AuthContext);
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const navigation = props.navigation;

    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [logoutDoneOpen, setLogoutDoneOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const anim = useRef(new Animated.Value(0)).current;

    // mở modal confirm
    const openLogoutModal = () => setLogoutModalOpen(true);
    const closeLogoutModal = () => {
        if (loggingOut) return;
        setLogoutModalOpen(false);
    };

    // animate modal khi mở/đóng
    useEffect(() => {
        Animated.timing(anim, {
            toValue: logoutModalOpen ? 1 : 0,
            duration: 160,
            useNativeDriver: true,
        }).start();
    }, [logoutModalOpen]);

    const handleConfirmLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);
        try {
            await logout();

            // đóng popup confirm
            setLogoutModalOpen(false);

            // mở popup "đăng xuất thành công"
            setLogoutDoneOpen(true);

            // chờ 700ms rồi reset về Login
            setTimeout(() => {
                setLogoutDoneOpen(false);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                });
            }, 700);
        } catch (e) {
            console.log("Logout error:", e);
            setLoggingOut(false);
            setLogoutModalOpen(false);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={[
                styles.drawerContainer,
                { backgroundColor: theme.colors.background },
            ]}
        >
            {/* ====== CONFIRM LOGOUT MODAL ====== */}
            <Modal
                visible={logoutModalOpen}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={closeLogoutModal}
            >
                <Pressable style={styles.modalBackdrop} onPress={closeLogoutModal}>
                    <Animated.View
                        style={[
                            styles.modalCard,
                            {
                                backgroundColor: theme.colors.card,
                                transform: [
                                    {
                                        scale: anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.95, 1],
                                        }),
                                    },
                                ],
                                opacity: anim,
                            },
                        ]}
                        // chặn click xuyên ra backdrop
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            Đăng xuất?
                        </Text>

                        <Text style={[styles.modalDesc, { color: theme.colors.secondary }]}>
                            Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng M-FLIX.
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                onPress={closeLogoutModal}
                                disabled={loggingOut}
                                style={[
                                    styles.modalBtn,
                                    { backgroundColor: theme.colors.background },
                                ]}
                            >
                                <Text style={[styles.modalBtnText, { color: theme.colors.text }]}>
                                    Ở lại
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleConfirmLogout}
                                disabled={loggingOut}
                                style={[
                                    styles.modalBtn,
                                    { backgroundColor: `${theme.colors.error}20` },
                                ]}
                            >
                                {loggingOut ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text style={[styles.modalBtnText, { color: theme.colors.error }]}>
                                        Đăng xuất
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>

            {/* ====== LOGOUT SUCCESS POPUP (TOAST) ====== */}
            <Modal visible={logoutDoneOpen} transparent animationType="fade" statusBarTranslucent>
                <View style={styles.toastBackdrop}>
                    <View style={[styles.toastCard, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.toastText, { color: theme.colors.text }]}>
                            Đăng xuất thành công!
                        </Text>
                    </View>
                </View>
            </Modal>
            <LinearGradient
                colors={[theme.colors.card, theme.colors.background]}
                style={styles.gradientBackground}
            >
                <View style={styles.profileSection}>
                    <View
                        style={[
                            styles.userAvatar,
                            { backgroundColor: theme.colors.border },
                        ]}
                    >
                        <UserIcon size={28} color={theme.colors.text} />
                    </View>
                    <Text
                        style={[
                            styles.userEmail,
                            { color: theme.colors.secondary },
                        ]}
                    >
                        {isLoggedIn ? userEmail : "Not Logged In"}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.menuContainer}>
                <DrawerItemList
                    {...props}
                    itemStyle={styles.menuItem}
                    labelStyle={[
                        styles.menuLabel,
                        { color: theme.colors.text },
                    ]}
                />
            </View>

            <TouchableOpacity
                onPress={toggleTheme}
                style={[
                    styles.themeButton,
                    { backgroundColor: theme.colors.card },
                ]}
            >
                <View style={styles.themeButtonContent}>
                    {isDarkMode ? (
                        <>
                            <SunIcon size={24} color={theme.colors.text} />
                            <Text
                                style={[
                                    styles.themeButtonText,
                                    { color: theme.colors.text },
                                ]}
                            >
                                Light Mode
                            </Text>
                        </>
                    ) : (
                        <>
                            <MoonIcon size={24} color={theme.colors.text} />
                            <Text
                                style={[
                                    styles.themeButtonText,
                                    { color: theme.colors.text },
                                ]}
                            >
                                Dark Mode
                            </Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>

            {isLoggedIn && (
                <TouchableOpacity
                    onPress={openLogoutModal}
                    style={[
                        styles.logoutButton,
                        { backgroundColor: `${theme.colors.error}20` },
                    ]}
                    activeOpacity={0.7}
                >
                    <View style={styles.logoutContent}>
                        <ArrowRightOnRectangleIcon
                            size={24}
                            color={theme.colors.error}
                        />
                        <Text
                            style={[
                                styles.logoutText,
                                { color: theme.colors.error },
                            ]}
                        >
                            Logout
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </DrawerContentScrollView>
    );
};

export default function DrawerNavigator() {
    const { theme } = useTheme();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: `${theme.colors.primary}20`,
                drawerActiveTintColor: theme.colors.primary,
                drawerInactiveTintColor: theme.colors.secondary,
                drawerLabelStyle: {
                    ...styles.drawerLabel,
                    color: theme.colors.text,
                },
                drawerStyle: {
                    backgroundColor: theme.colors.background,
                    width: 280,
                    zIndex: 999, // Tùy chọn này có thể không cần thiết, nhưng có thể giúp đảm bảo Drawer ở trên các phần tử khác
                },
                drawerType: "overlay", // Sử dụng "overlay" để drawer hiện đè lên màn hình
                drawerPosition: "left",
                drawerHideStatusBarOnOpen: false, // Giữ cho status bar hiển thị khi drawer mở
                swipeEdgeWidth: 0, // Tắt khả năng vuốt khi Drawer hiện lên
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Home",
                    drawerIcon: ({ color }) => (
                        <HomeIcon size={22} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Favorites"
                component={FavoriteScreen}
                options={{
                    title: "Favorites",
                    drawerIcon: ({ color }) => (
                        <HeartIcon size={22} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Upcoming"
                component={UpcomingScreen}
                options={{
                    title: "Upcoming Movies",
                    drawerIcon: ({ color }) => (
                        <ClockIcon size={22} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Toprate"
                component={TopRatedScreen}
                options={{
                    title: "Top Rated Movies",
                    drawerIcon: ({ color }) => (
                        <FilmIcon size={22} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    gradientBackground: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    profileSection: {
        alignItems: "center",
        marginBottom: 10,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    userName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
    },
    menuContainer: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    menuItem: {
        borderRadius: 10,
        marginVertical: 4,
    },
    menuLabel: {
        marginLeft: -15,
        fontSize: 15,
    },
    drawerLabel: {
        marginLeft: -15,
        fontSize: 15,
        fontWeight: "500",
    },
    themeButton: {
        margin: 20,
        borderRadius: 10,
        paddingVertical: 12,
    },
    themeButtonContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 12,
    },
    themeButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },
    logoutButton: {
        margin: 20,
        marginTop: 10,
        borderRadius: 10,
        paddingVertical: 12,
    },
    logoutContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 12,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: "600",
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    modalCard: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 16,
        padding: 16,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    modalDesc: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
    },

    modalActions: {
        marginTop: 16,
        flexDirection: "row",
        gap: 10,
    },

    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    modalBtnText: {
        fontSize: 15,
        fontWeight: "700",
    },

    toastBackdrop: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.25)",
        padding: 20,
    },

    toastCard: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
    },

    toastText: {
        fontSize: 15,
        fontWeight: "700",
    },
});
