import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    Animated,
    Easing,
    StyleSheet,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Bars3CenterLeftIcon,
    MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import { useTheme } from "../components/context/ThemeContext";
import { API } from "../api/api"; // axios client
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrendingMovies from "../components/trendingMovies";


const ios = Platform.OS === "ios";
const HEADER_HEIGHT = ios ? 60 : 70;
const RECENTLY_KEY = "recentlySeen";

const norm = (s) => (s ?? "").toString().trim().toLowerCase().replace(/\s+/g, " ");
const date10 = (d) => (d ? String(d).slice(0, 10) : "");

function safeParseDate(value) {
    const t = Date.parse(value);
    return Number.isFinite(t) ? new Date(t) : null;
}

// ưu tiên field nào có thì lấy làm "điểm" để sort
function getMovieScore(m) {
    return (
        m?.voteAverage ??
        m?.rating ??
        m?.imdbRating ??
        m?.popularity ??
        m?.views ??
        0
    );
}

function hasGenre(movie, genreId) {
    const list = movie?.genres || [];
    return list.some(
        (g) => g?.genreId === genreId || g?.id === genreId
    );
}

function getMostWatchedGenres(movies) {
    const genreCount = {};

    movies.forEach((movie) => {
        if (!movie?.genres) return;
        movie.genres.forEach((g) => {
            const key = g?.genreId ?? g?.id;
            if (!key) return;

            if (genreCount[key]) {
                genreCount[key].count += 1;
            } else {
                genreCount[key] = { ...g, count: 1 };
            }
        });
    });

    return Object.values(genreCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 2); // top 2 genres
}

const getMovieKey = (m) => {
  const title = norm(m?.title ?? m?.name);
  const date = date10(m?.releaseDate ?? m?.release_date);
  if (title) return `${title}|${date}`;
  const id = m?._id ?? m?.id;
  return id ? `id:${id}` : "";
};

async function addRecentlySeen(movie, limit = 20) {
  const raw = await AsyncStorage.getItem(RECENTLY_KEY);
  const list = raw ? JSON.parse(raw) : [];
  const safe = Array.isArray(list) ? list : [];

  const key = getMovieKey(movie);
  const next = [movie, ...safe.filter((m) => getMovieKey(m) !== key)].slice(0, limit);

  await AsyncStorage.setItem(RECENTLY_KEY, JSON.stringify(next));
  return next;
}

function uniqueByKey(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const key = getMovieKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export default function HomeScreen() {
    const navigation = useNavigation();
    const { theme, isDarkMode } = useTheme();
    const insets = useSafeAreaInsets();
    const HEADER_TOTAL = HEADER_HEIGHT + (insets?.top || 0);

    // DATA states 
    const [trending, setTrending] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [recentlySeen, setRecentlySeen] = useState([]);
    const [recommendedMovies, setRecommendedMovies] = useState([]);

    // giữ allMovies để recommend/filter
    const [allMovies, setAllMovies] = useState([]);

    const [loading, setLoading] = useState(true);

    // animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const headerY = useRef(new Animated.Value(-HEADER_HEIGHT)).current;
    const contentY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        loadData();
        startAnimations();
    }, []);

    // mỗi lần quay lại Home -> reload recently + recommend
    useFocusEffect(
        useCallback(() => {
            const run = async () => {
                const seen = await loadRecentlySeen();
                await loadRecommendedMovies(seen);
            };
            run();
        }, [allMovies])
    );

    const loadData = async () => {
        try {
            console.log("CALL API: /api/movies");
            const res = await API.get("/movies");
            const list = Array.isArray(res.data) ? res.data : [];

            console.log("API RESPONSE STATUS:", res.status);
            console.log("MOVIES DATA:", list);

            setAllMovies(list);

            // ====== client-side phân loại ======
            const now = new Date();

            // Upcoming: releaseDate > hiện tại (nếu field có)
            const up = list
                .filter((m) => {
                    const d = safeParseDate(m?.releaseDate);
                    return d && d > now;
                })
                .sort((a, b) => safeParseDate(a.releaseDate) - safeParseDate(b.releaseDate));

            // Top Rated: sort theo score (rating/voteAverage/...)
            const top = [...list].sort((a, b) => getMovieScore(b) - getMovieScore(a));

            // Trending: nếu có popularity/views thì tự sort; nếu không thì lấy top list
            const trend = [...list]
                .sort((a, b) => {
                    const vb = b?.viewCount ?? 0;
                    const va = a?.viewCount ?? 0;
                    if (vb !== va) return vb - va;

                    const tb = b?.lastViewedAt ? new Date(b.lastViewedAt).getTime() : 0;
                    const ta = a?.lastViewedAt ? new Date(a.lastViewedAt).getTime() : 0;
                    return tb - ta;
                })
                .slice(0, 10);
            setTrending(trend);

            setUpcoming(up);
            setTopRated(top);
            setTrending(trend);
        } catch (err) {
            console.log("FETCH MOVIES ERROR:", err?.message);
        } finally {
            setLoading(false);
        }
    };

    const loadRecentlySeen = async () => {
        try {
            const res = await API.get("/recently-seen?limit=10");

            // nhận cả: array / {items: array} / {data: array}
            const raw = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.items)
                    ? res.data.items
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];

            // nhận cả: x.movieId (populate) / x.movie / hoặc x chính là movie object
            const movies = raw
                .map((x) => x?.movieId || x?.movie || x)
                .filter((m) => m && (m._id || m.id || m.title));

            // chuẩn hoá posterUrl
            const serverBase = API.defaults.baseURL?.replace("/api", "");
            const withPoster = movies.map((m) => {
                const posterUrl =
                    m.posterUrl || (m.poster ? `${serverBase}/uploads/posters/${m.poster}` : "");
                return { ...m, posterUrl };
            });

            setRecentlySeen(withPoster);
            return withPoster;
        } catch (error) {
            console.error("Error loading recently seen movies:", error?.response?.data || error?.message);
            setRecentlySeen([]);
            return [];
        }
    };

    const loadRecommendedMovies = async (seen) => {
        if (!seen?.length) {
            setRecommendedMovies([]);
            return;
        }

        const topGenres = getMostWatchedGenres(seen);
        if (!topGenres.length) {
            setRecommendedMovies([]);
            return;
        }

        // recommend từ allMovies theo genre (không cần endpoint genre)
        const rec = [];
        for (const g of topGenres) {
            const gid = g?.genreId ?? g?.id;
            if (!gid) continue;

            const sameGenre = allMovies.filter((m) => hasGenre(m, gid));
            const unseen = sameGenre.filter(
                (m) => !seen.find((s) => (s?._id ?? s?.id) === (m?._id ?? m?.id))
            );

            rec.push(...unseen.slice(0, 6));
        }

        setRecommendedMovies(uniqueByKey(rec));
    };

    const startAnimations = () => {
        Animated.timing(headerY, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(contentY, {
                toValue: 0,
                duration: 800,
                delay: 200,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleOpenMovie = async (movie) => {
        try {
            if (movie?._id) {
                await Promise.allSettled([
                    API.post(`/movies/${movie._id}/view`),
                    API.post(`/recently-seen`, { movieId: movie._id }), // lưu DB
                ]);
            }
        } catch (e) {
            console.log("view/recently error:", e?.response?.data || e?.message);
        } finally {
            navigation.navigate("Movie", movie);
        }
    };

    if (loading) return <Loading />;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            {/* HEADER */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        backgroundColor: theme.colors.background,
                        transform: [{ translateY: headerY }],
                        paddingTop: insets.top,
                    },
                ]}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Bars3CenterLeftIcon
                            size={28}
                            strokeWidth={2}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>

                    <Text style={[styles.logo, { color: theme.colors.text }]}>
                        <Text style={{ color: theme.colors.primary }}>M</Text>
                        FLIX
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Search")}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <MagnifyingGlassIcon
                            size={28}
                            strokeWidth={2}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* CONTENT */}
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: HEADER_TOTAL + 16 },
                ]}
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: contentY }],
                }}
            >
                {/* TRENDING */}
                {trending.length > 0 && (
                    <TrendingMovies
                        data={trending.slice(0, 10)}
                        onPressItem={handleOpenMovie}
                    />
                )}

                {/* RECENTLY */}
                {recentlySeen.length > 0 && (
                    <View style={styles.section}>
                        <MovieList title="Recently Seen" data={recentlySeen.slice(0, 10)} hideSeeAll={true} />
                    </View>
                )}

                {/* RECOMMENDED */}
                {recommendedMovies.length > 0 && (
                    <View style={styles.section}>
                        <MovieList title="Recommended for You" data={recommendedMovies.slice(0, 10)} hideSeeAll={true} />
                    </View>
                )}

                {/* UPCOMING */}
                {upcoming.length > 0 && (
                    <View style={styles.section}>
                        <MovieList title="Upcoming Movies" data={upcoming.slice(0, 10)} hideSeeAll={true} />
                    </View>
                )}

                {/* TOP RATED */}
                {topRated.length > 0 && (
                    <View style={styles.section}>
                        <MovieList title="Top Rated Movies" data={topRated.slice(0, 10)} hideSeeAll={true} />
                    </View>
                )}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        height: HEADER_HEIGHT,
    },
    logo: {
        fontSize: 28,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    iconButton: { padding: 8 },
    scrollContent: { paddingBottom: 30 },
    section: { marginBottom: 24 },
});
