// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     Image,
//     Dimensions,
//     TouchableOpacity,
//     ScrollView,
//     Platform,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient";
// import { ChevronLeftIcon } from "react-native-heroicons/outline";
// import { HeartIcon } from "react-native-heroicons/solid";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { styles, theme } from "../theme";
// import Loading from "../components/loading";

// const ios = Platform.OS === "ios";
// const topMargin = ios ? "" : " mt-3";
// const { width, height } = Dimensions.get("window");

// const getYoutubeId = (url) => {
//   if (!url || typeof url !== "string") return ""; // chặn null
//   const match = url.match(
//     /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
//   );
//   return match?.[1] || "";
// };

// export default function MovieScreen() {
//     const { params: movie } = useRoute(); // movie từ API riêng
//     const navigation = useNavigation();

//     const [isFavourite, setIsFavourite] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!movie?._id) {
//             console.log("❌ Movie param invalid:", movie);
//             setLoading(false);
//             return;
//         }

//         checkFavourite();
//         saveToRecentlySeen(movie);
//         setLoading(false);
//     }, [movie]);

//     async function saveToRecentlySeen(movieItem) {
//         try {
//             const data = await AsyncStorage.getItem("recentlySeen");
//             let list = data ? JSON.parse(data) : [];

//             list = list.filter((m) => m._id !== movieItem._id);
//             list.unshift(movieItem);

//             if (list.length > 20) list = list.slice(0, 20);
//             await AsyncStorage.setItem("recentlySeen", JSON.stringify(list));
//         } catch (e) {
//             console.log("Save recently seen error:", e);
//         }
//     }

//     async function checkFavourite() {
//         const data = await AsyncStorage.getItem("favorites");
//         const list = data ? JSON.parse(data) : [];
//         setIsFavourite(list.some((m) => m._id === movie._id));
//     }

//     async function handleToggleFavorite() {
//         try {
//             let data = await AsyncStorage.getItem("favorites");
//             let list = data ? JSON.parse(data) : [];

//             if (isFavourite) {
//                 list = list.filter((m) => m._id !== movie._id);
//             } else {
//                 list.unshift(movie);
//             }

//             await AsyncStorage.setItem("favorites", JSON.stringify(list));
//             setIsFavourite(!isFavourite);
//         } catch (e) {
//             console.log("Toggle favorite error:", e);
//         }
//     }

//     if (loading) return <Loading />;

//     return (
//         <ScrollView
//             contentContainerStyle={{ paddingBottom: 20 }}
//             className="flex-1 bg-neutral-900"
//         >
//             {/* HEADER */}
//             <View className="w-full">
//                 <SafeAreaView
//                     className={
//                         "absolute z-20 w-full flex-row justify-between items-center px-4 " +
//                         topMargin
//                     }
//                 >
//                     <TouchableOpacity
//                         style={styles.background}
//                         className="rounded-xl p-1"
//                         onPress={() => navigation.goBack()}
//                     >
//                         <ChevronLeftIcon size={28} color="white" />
//                     </TouchableOpacity>

//                     <TouchableOpacity onPress={handleToggleFavorite}>
//                         <HeartIcon
//                             size={35}
//                             color={isFavourite ? theme.background : "white"}
//                         />
//                     </TouchableOpacity>
//                 </SafeAreaView>

//                 <View>
//                     <Image
//                         source={{
//                             uri:
//                                 movie.posterUrl ||
//                                 "https://via.placeholder.com/500x750?text=No+Image",
//                         }}
//                         style={{ width, height: height * 0.55 }}
//                     />

//                     <LinearGradient
//                         colors={[
//                             "transparent",
//                             "rgba(23,23,23,0.8)",
//                             "rgba(23,23,23,1)",
//                         ]}
//                         style={{ width, height: height * 0.4 }}
//                         className="absolute bottom-0"
//                     />
//                 </View>
//             </View>

//             {/* CONTENT */}
//             <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
//                 <Text className="text-white text-center text-3xl font-bold">
//                     {movie.title}
//                 </Text>

//                 <Text className="text-neutral-400 text-center">
//                     {movie.releaseDate?.split("-")[0] || "N/A"}
//                 </Text>

//                 <View className="flex-row justify-center mx-4 flex-wrap">
//                     {movie.genres?.map((g, i) => (
//                         <Text
//                             key={i}
//                             className="text-neutral-400 mx-1"
//                         >
//                             {g.name}
//                         </Text>
//                     ))}
//                 </View>

//                 <Text className="text-neutral-400 mx-4 tracking-wide">
//                     {movie.overview || "No description"}
//                 </Text>

//                 {/* DIRECTOR */}
//                 <View className="mx-4 mt-4">
//                     <Text className="text-white text-lg font-semibold mb-2">Đạo diễn</Text>

//                     {movie?.director ? (
//                         <Text className="text-neutral-300">
//                             {typeof movie.director === "string"
//                                 ? movie.director
//                                 : movie.director?.name || "N/A"}
//                         </Text>
//                     ) : (
//                         <Text className="text-neutral-500">Chưa có dữ liệu đạo diễn</Text>
//                     )}
//                 </View>

//                 {/* CAST */}
//                 <View className="mx-4 mt-4">
//                     <Text className="text-white text-lg font-semibold mb-2">Diễn viên</Text>

//                     {Array.isArray(movie?.cast) && movie.cast.length > 0 ? (
//                         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                             {movie.cast.slice(0, 15).map((c, idx) => {
//                                 const p = c?.person || c; // nếu populate: c.person, nếu không: c
//                                 const key = p?._id || c?._id || idx;

//                                 const name =
//                                     typeof p === "string" ? p : p?.name || "N/A";

//                                 const avatar =
//                                     (typeof p === "object" && (p?.profileUrl || p?.profilePath)) ||
//                                     "https://via.placeholder.com/185x278?text=No+Image";

//                                 return (
//                                     <View key={key} className="mr-3" style={{ width: 120 }}>
//                                         <Image
//                                             source={{ uri: avatar }}
//                                             style={{ width: 110, height: 160, borderRadius: 12 }}
//                                         />
//                                         <Text className="text-neutral-200 mt-2" numberOfLines={1}>
//                                             {name}
//                                         </Text>

//                                         {!!c?.character && (
//                                             <Text className="text-neutral-500 text-xs" numberOfLines={1}>
//                                                 {c.character}
//                                             </Text>
//                                         )}
//                                     </View>
//                                 );
//                             })}
//                         </ScrollView>
//                     ) : (
//                         <Text className="text-neutral-500">Chưa có dữ liệu diễn viên</Text>
//                     )}
//                 </View>
//             </View>

//             {/* TRAILER */}
//             <TouchableOpacity
//                 style={{
//                     position: "absolute",
//                     top: 200,
//                     left: width / 2 - 35,
//                     backgroundColor: "rgba(0,0,0,0.4)",
//                     padding: 18,
//                     borderRadius: 100,
//                 }}
//                 // onPress={() =>
//                 //     navigation.navigate("Trailer", {
//                 //         videoId: "fX3qI4lQ6P0", // hoặc backend trả về
//                 //     })
//                 // }
//                 onPress={() => {
//                     const videoId = getYoutubeId(movie?.videoUrl);

//                     if (!videoId) {
//                         console.log("❌ Phim này chưa có videoUrl:", movie?.title);
//                         return;
//                     }

//                     navigation.navigate("Trailer", { videoId });
//                 }}
//             >
//                 <Text style={{ color: "white", fontSize: 28 }}>▶</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// }
import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, Image, Dimensions, TouchableOpacity,
  ScrollView, Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, theme } from "../theme";
import Loading from "../components/loading";
import { fetchMovieDetails, fetchMovieCredits, fallbackPersonImage } from "../api/moviedb";

const ios = Platform.OS === "ios";
const topMargin = ios ? "" : " mt-3";
const { width, height } = Dimensions.get("window");

const getYoutubeId = (url) => {
  if (!url || typeof url !== "string") return "";
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match?.[1] || "";
};

export default function MovieScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const initialMovie = route?.params || {};
  const movieId = initialMovie?._id || initialMovie?.id;

  const [movie, setMovie] = useState(initialMovie);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) Fetch movie detail + credits
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // detail
        const detail = await fetchMovieDetails(movieId);
        if (!cancelled && detail) setMovie((prev) => ({ ...prev, ...detail }));

        // credits (director + cast)
        const credits = await fetchMovieCredits(movieId);
        if (!cancelled && credits) {
          setMovie((prev) => ({
            ...prev,
            director: credits.director ?? prev.director,
            cast: credits.cast ?? prev.cast,
          }));
        }
      } catch (e) {
        console.log("❌ Load movie error:", e?.message || e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  // 2) Favorite + RecentlySeen (chạy sau khi có movieId)
  useEffect(() => {
    if (!movieId) return;
    checkFavourite(movieId);
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;
    // lưu bản movie hiện tại (sau khi fetch có thể đầy đủ hơn)
    saveToRecentlySeen({ ...movie, _id: movieId });
  }, [movieId, movie?.title, movie?.posterUrl]); // tránh chạy quá nhiều lần

  async function saveToRecentlySeen(movieItem) {
    try {
      const data = await AsyncStorage.getItem("recentlySeen");
      let list = data ? JSON.parse(data) : [];

      list = list.filter((m) => (m?._id || m?.id) !== movieId);
      list.unshift(movieItem);

      if (list.length > 20) list = list.slice(0, 20);
      await AsyncStorage.setItem("recentlySeen", JSON.stringify(list));
    } catch (e) {
      console.log("Save recently seen error:", e);
    }
  }

  async function checkFavourite(id) {
    const data = await AsyncStorage.getItem("favorites");
    const list = data ? JSON.parse(data) : [];
    setIsFavourite(list.some((m) => (m?._id || m?.id) === id));
  }

  async function handleToggleFavorite() {
    try {
      const data = await AsyncStorage.getItem("favorites");
      let list = data ? JSON.parse(data) : [];

      if (isFavourite) {
        list = list.filter((m) => (m?._id || m?.id) !== movieId);
      } else {
        list.unshift({ ...movie, _id: movieId });
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(list));
      setIsFavourite(!isFavourite);
    } catch (e) {
      console.log("Toggle favorite error:", e);
    }
  }

  if (loading) return <Loading />;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="flex-1 bg-neutral-900">
      {/* HEADER */}
      <View className="w-full">
        <SafeAreaView className={"absolute z-20 w-full flex-row justify-between items-center px-4 " + topMargin}>
          <TouchableOpacity style={styles.background} className="rounded-xl p-1" onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToggleFavorite}>
            <HeartIcon size={35} color={isFavourite ? theme.background : "white"} />
          </TouchableOpacity>
        </SafeAreaView>

        <View>
          <Image
            source={{ uri: movie.posterUrl || "https://via.placeholder.com/500x750?text=No+Image" }}
            style={{ width, height: height * 0.55 }}
          />

          <LinearGradient
            colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
            style={{ width, height: height * 0.4 }}
            className="absolute bottom-0"
          />
        </View>
      </View>

      {/* CONTENT */}
      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold">{movie.title}</Text>
        <Text className="text-neutral-400 text-center">{movie.releaseDate?.split("-")[0] || "N/A"}</Text>

        <View className="flex-row justify-center mx-4 flex-wrap">
          {movie.genres?.map((g, i) => (
            <Text key={i} className="text-neutral-400 mx-1">{g.name}</Text>
          ))}
        </View>

        <Text className="text-neutral-400 mx-4 tracking-wide">{movie.overview || "No description"}</Text>

        {/* DIRECTOR */}
        <View className="mx-4 mt-4">
          <Text className="text-white text-lg font-semibold mb-2">Đạo diễn</Text>
          {movie?.director ? (
            <Text className="text-neutral-300">
              {typeof movie.director === "string" ? movie.director : movie.director?.name || "N/A"}
            </Text>
          ) : (
            <Text className="text-neutral-500">Chưa có dữ liệu đạo diễn</Text>
          )}
        </View>

        {/* CAST */}
        <View className="mx-4 mt-4">
          <Text className="text-white text-lg font-semibold mb-2">Diễn viên</Text>

          {Array.isArray(movie?.cast) && movie.cast.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movie.cast.slice(0, 15).map((c, idx) => {
                const p = c?.person || c;
                const key = p?._id || c?._id || idx;
                const name = typeof p === "string" ? p : p?.name || "N/A";

                const avatar =
                  (typeof p === "object" && (p?.profileUrl || p?.profilePath)) ||
                  fallbackPersonImage ||
                  "https://via.placeholder.com/185x278?text=No+Image";

                return (
                  <View key={key} className="mr-3" style={{ width: 120 }}>
                    <Image source={{ uri: avatar }} style={{ width: 110, height: 160, borderRadius: 12 }} />
                    <Text className="text-neutral-200 mt-2" numberOfLines={1}>{name}</Text>

                    {!!c?.character && (
                      <Text className="text-neutral-500 text-xs" numberOfLines={1}>{c.character}</Text>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text className="text-neutral-500">Chưa có dữ liệu diễn viên</Text>
          )}
        </View>
      </View>

      {/* TRAILER */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 200,
          left: width / 2 - 35,
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 18,
          borderRadius: 100,
        }}
        onPress={() => {
          const videoId = getYoutubeId(movie?.videoUrl);
          if (!videoId) {
            console.log("❌ Phim này chưa có videoUrl:", movie?.title);
            return;
          }
          navigation.navigate("Trailer", { videoId });
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>▶</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
