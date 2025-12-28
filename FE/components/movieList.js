import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function MovieList({ title, hideSeeAll, data }) {
    const navigation = useNavigation();
    if (!data || data.length === 0) return null;

    return (
        <View style={{ marginBottom: 32 }}>
            {title && (
                <Text style={{ color: "white", fontSize: 18, marginLeft: 16, marginBottom: 12 }}>
                    {title}
                </Text>
            )}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {data.map((item) => (
                    <TouchableWithoutFeedback
                        key={item._id}
                        onPress={() => navigation.push("Movie", item)}
                    >
                        <View style={{ marginRight: 16 }}>
                            <Image
                                source={{ uri: item.posterUrl }} // 🔥 CHỈ DÒNG NÀY
                                style={{
                                    width: width * 0.33,
                                    height: height * 0.22,
                                    borderRadius: 16,
                                    backgroundColor: "#222",
                                }}
                                resizeMode="cover"
                            />

                            <Text
                                style={{
                                    color: "#d4d4d4",
                                    marginTop: 6,
                                    width: width * 0.33,
                                }}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </ScrollView>
        </View>
    );
}
