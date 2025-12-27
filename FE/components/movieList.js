// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableWithoutFeedback,
//     Image,
//     Dimensions,
//     TouchableOpacity,
// } from "react-native";
// import React from "react";
// import { useNavigation } from "@react-navigation/native";
// import { styles as themeStyles } from "../theme";
// import { fallbackMoviePoster } from "../api/moviedb";

// const { width, height } = Dimensions.get("window");

// /**
//  * Chuẩn hóa URL poster cho mọi nguồn data
//  * - TMDB: poster_path
//  * - Local / AsyncStorage: posterPath
//  */
// const getPosterUrl = (item) => {
//     const path = item?.poster_path || item?.posterPath;

//     if (!path) return fallbackMoviePoster;

//     // Nếu đã là URL đầy đủ
//     if (path.startsWith("http")) return path;

//     // TMDB poster
//     return `https://image.tmdb.org/t/p/w342${path}`;
// };

// export default function MovieList({ title, hideSeeAll, data }) {
//     const navigation = useNavigation();

//     if (!data || data.length === 0) return null;

//     return (
//         <View style={{ marginBottom: 32 }}>
//             {/* HEADER */}
//             {title && (
//                 <View
//                     style={{
//                         marginHorizontal: 16,
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginBottom: 12,
//                     }}
//                 >
//                     <Text style={{ color: "white", fontSize: 18 }}>
//                         {title}
//                     </Text>

//                     {!hideSeeAll && (
//                         <TouchableOpacity activeOpacity={0.6}>
//                             <Text
//                                 style={[
//                                     themeStyles.text,
//                                     { fontSize: 16 },
//                                 ]}
//                             >
//                                 See All
//                             </Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             )}

//             {/* MOVIE LIST */}
//             <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingHorizontal: 16 }}
//             >
//                 {data.map((item, index) => {
//     console.log("🎬 MOVIE ITEM:", {
//         title: item.title,
//         poster_path: item.poster_path,
//         posterPath: item.posterPath,
//     });

//     return (
//         <TouchableWithoutFeedback
//             key={item._id || item.id || index}
//             onPress={() => navigation.push("Movie", item)}
//         >
//             <View style={{ marginRight: 16 }}>
//                 {/* POSTER */}
//                 <Image
//                     source={{ uri: getPosterUrl(item) }}
//                     style={{
//                         width: width * 0.33,
//                         height: height * 0.22,
//                         borderRadius: 16,
//                         backgroundColor: "#222",
//                     }}
//                     resizeMode="cover"
//                 />

//                 {/* TITLE */}
//                 <Text
//                     style={{
//                         color: "#d4d4d4",
//                         marginTop: 6,
//                         marginLeft: 4,
//                         width: width * 0.33,
//                     }}
//                     numberOfLines={1}
//                 >
//                     {item?.title || item?.name || "Untitled"}
//                 </Text>
//             </View>
//         </TouchableWithoutFeedback>
//     );
// })}

//             </ScrollView>
//         </View>
//     );
// }
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
                <Text style={{ color: "white", fontSize: 18, marginLeft: 16 }}>
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
