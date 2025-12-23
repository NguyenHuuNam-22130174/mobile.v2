import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import {
    fallbackMoviePoster,
    fetchMovieCredits,
    fetchMovieDetails,
    fetchSimilarMovies,
    image500,
    trailerVideoMap,
} from "../api/moviedb";
import { styles, theme } from "../theme";
import Loading from "../components/loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ios = Platform.OS === "ios";
const topMargin = ios ? "" : " mt-3";
const { width, height } = Dimensions.get("window");

export default function MovieScreen() {
    const { params: item } = useRoute();
    const navigation = useNavigation();
    const [movie, setMovie] = useState({});
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [isFavourite, toggleFavourite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getMovieDetails(item.id);
        getMovieCredits(item.id);
        getSimilarMovies(item.id);
    }, [item]);
    async function saveToRecentlySeen(movieItem) {
        const data = await AsyncStorage.getItem("recentlySeen");
        let list = data ? JSON.parse(data) : [];
        list = list.filter((m) => m.id !== movieItem.id);
        list.unshift(movieItem);
        if (list.length > 20) list = list.slice(0, 20);
        await AsyncStorage.setItem("recentlySeen", JSON.stringify(list));
    }

    async function getMovieDetails(id) {
        const data = await fetchMovieDetails(id);
        setLoading(false);
        if (data) setMovie({ ...movie, ...data });
    }

    async function getMovieCredits(id) {
        const data = await fetchMovieCredits(id);
        if (data && data.cast) setCast(data.cast);
    }

    async function getSimilarMovies(id) {
        const data = await fetchSimilarMovies(id);
        if (data && data.results) setSimilarMovies(data.results);
    }

    async function handleToggleFavorite() {
        toggleFavourite(!isFavourite);
        try {
            let currentList = await AsyncStorage.getItem("favorites");
            currentList = currentList ? JSON.parse(currentList) : [];
            const alreadyExist = currentList.find((m) => m.id === movie.id);
            if (!alreadyExist) {
                currentList.push(movie);
                await AsyncStorage.setItem(
                    "favorites",
                    JSON.stringify(currentList)
                );
            }
        } catch {}
    }

    const trailerKey = trailerVideoMap[item.id] || "fX3qI4lQ6P0";
    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            className="flex-1 bg-neutral-900"
        >
            <View className="w-full">
                <SafeAreaView
                    className={
                        "absolute z-20 w-full flex-row justify-between items-center px-4 " +
                        topMargin
                    }
                >
                    <TouchableOpacity
                        style={styles.background}
                        className="rounded-xl p-1"
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeftIcon
                            size={28}
                            strokeWidth={2.5}
                            color="white"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleToggleFavorite}>
                        <HeartIcon
                            size={35}
                            color={isFavourite ? theme.background : "white"}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                {loading ? (
                    <Loading />
                ) : (
                    <View>
                        <Image
                            source={{
                                uri:
                                    image500(movie.poster_path) ||
                                    fallbackMoviePoster,
                            }}
                            style={{ width, height: height * 0.55 }}
                        />
                        <LinearGradient
                            colors={[
                                "transparent",
                                "rgba(23, 23, 23, 0.8)",
                                "rgba(23, 23, 23, 1)",
                            ]}
                            style={{ width, height: height * 0.4 }}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            className="absolute bottom-0"
                        />
                    </View>
                )}
            </View>
            <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
                <Text className="text-white text-center text-3xl font-bold tracking-widest">
                    {movie?.title}
                </Text>
                {movie?.id ? (
                    <Text className="text-neutral-400 font-semibold text-base text-center">
                        {movie?.status} •{" "}
                        {movie?.release_date?.split("-")[0] || "N/A"} •{" "}
                        {movie?.runtime} min
                    </Text>
                ) : null}
                <View className="flex-row justify-center mx-4 space-x-2">
                    {movie?.genres?.map((genre, index) => {
                        let showDot = index + 1 !== movie.genres.length;
                        return (
                            <Text
                                key={index}
                                className="text-neutral-400 font-semibold text-base text-center"
                            >
                                {genre?.name}
                                {showDot ? " •" : ""}
                            </Text>
                        );
                    })}
                </View>
                <Text className="text-neutral-400 mx-4 tracking-wide">
                    {movie?.overview}
                </Text>
            </View>
            {movie?.id && cast.length > 0 && (
                <Cast navigation={navigation} cast={cast} />
            )}
            {movie?.id && similarMovies.length > 0 && (
                <MovieList
                    title="Similar Movies"
                    hideSeeAll
                    data={similarMovies}
                />
            )}
            <TouchableOpacity
                style={{
                    position: "absolute",
                    top: 200,
                    left: 170,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    borderRadius: 100,
                }}
                onPress={async () => {
                    await saveToRecentlySeen(movie);
                    navigation.navigate("Trailer", { videoId: trailerKey });
                }}
            >
                <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 30 }}
                >
                    ▶
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
