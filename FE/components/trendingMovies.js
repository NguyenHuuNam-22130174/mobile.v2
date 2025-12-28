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
        renderItem={({ item }) => (
          <MovieCard handleClick={handleClick} item={item} />
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

const MovieCard = ({ item, handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: item?.posterUrl }}   // ✅ dùng posterUrl từ API của bạn
          style={{
            width: width * 0.6,
            height: height * 0.4,
            borderRadius: 24,
            backgroundColor: "#222",
          }}
          resizeMode="cover"
        />

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
