import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { theme } from "../theme";

const { width, height } = Dimensions.get("window");

export default function Loading() {
    return (
        <View style={[styles.loadingContainer, { height, width }]}>
            <Progress.CircleSnail
                thickness={12}
                size={160}
                color={theme.background}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
    },
});
