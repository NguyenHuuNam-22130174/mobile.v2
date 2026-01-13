import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function TrendingMovies({ data, onPressItem }) {
  const navigation = useNavigation();

  const handleClick = (item) => {
    // nếu HomeScreen truyền onPressItem thì dùng nó (để gọi API viewCount, recentlySeen...)
    if (onPressItem) return onPressItem(item);

    // fallback: chỉ navigate
    navigation.navigate("Movie", item);
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: "white", fontSize: 20, marginHorizontal: 16, marginBottom: 12 }}>
        Trending
      </Text>

      <Carousel
        data={data}
        keyExtractor={(item, index) =>
          String(item?._id ?? item?.id ?? `${item?.title}-${index}`)
        }
        renderItem={({ item, index }) => (
          <MovieCard handleClick={handleClick} item={item} rank={index + 1} />
        )}
        firstItem={1}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={{ display: "flex", alignItems: "center" }}
      />
    </View>
  );
}

const MovieCard = ({ item, handleClick, rank }) => {
  const posterW = width * 0.6;
  const posterH = height * 0.4;
  const radius = 24;

  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <View style={{ alignItems: "center" }}>
        {/* Wrap poster để đặt badge absolute */}
        <View
          style={{
            width: posterW,
            height: posterH,
            borderRadius: radius,
            overflow: "hidden",
            backgroundColor: "#222",
            position: "relative",
          }}
        >
          <Image
            source={{ uri: item?.posterUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Rank badge: top-right */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              minWidth: 26,
              height: 26,
              paddingHorizontal: 7,
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.75)",
              zIndex: 10,
              elevation: 10,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800", fontSize: 12 }}>
              {rank}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 16,
            marginTop: 8,
            fontWeight: "600",
            textAlign: "center",
            width: width * 0.6,
          }}
          numberOfLines={1}
        >
          {item?.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
