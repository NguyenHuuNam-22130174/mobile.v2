import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function TrailerScreen({ route }) {
  const videoId = route.params?.videoId || "";
  const { width } = Dimensions.get("window");
  return (
    <View style={styles.container}>
      <YoutubePlayer height={220} width={width} play videoId={videoId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
