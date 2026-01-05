import React, { useEffect, useMemo, useState } from "react";
import {
  View, Text, Image, Dimensions, TouchableOpacity,
  ScrollView, Platform, TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles, theme } from "../theme";
import Loading from "../components/loading";
import { fetchMovieDetails, fetchMovieCredits, fallbackPersonImage, fetchSimilarMovies, postRating } from "../api/moviedb";

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
  const params = route?.params ?? {};

  const initialMovie = useMemo(() => {
    return params && typeof params === "object" ? params : {};
  }, [params]);

  const movieId = useMemo(() => {
    const id = params?._id ?? params?.id ?? params?.movieId;
    return id ? String(id) : "";
  }, [params]);

  const [movie, setMovie] = useState(initialMovie);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [hasRated, setHasRated] = useState(false);

  const [myRating, setMyRating] = useState(10);     // 1..10
  const [myReview, setMyReview] = useState("");   // optional
  const [submitting, setSubmitting] = useState(false);

  const RATINGS_KEY = "ratings_local";

  const FIVE_MILESTONES = [
    { value: 2, label: "Dở tệ", emoji: "😭" },
    { value: 4, label: "Phim chán", emoji: "😕" },
    { value: 6, label: "Khá ổn", emoji: "🙂" },
    { value: 8, label: "Phim hay", emoji: "😊" },
    { value: 10, label: "Tuyệt vời", emoji: "😍" },
  ];

  const getMilestoneLabel = (v) =>
    FIVE_MILESTONES.find((x) => x.value === v)?.label || "";

  const FiveMilestoneTenPicker = ({
    value,
    onChange,
    activeColor = "#ef4444",
    disabled = false,
  }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 16,
          backgroundColor: "#111827",
          borderWidth: 1,
          borderColor: "#1f2937",
          opacity: disabled ? 0.7 : 1, // nhìn như bị khóa
        }}
      >
        {FIVE_MILESTONES.map((m) => {
          const active = m.value === value;

          return (
            <TouchableOpacity
              key={m.value}
              disabled={disabled} // chặn bấm
              onPress={() => {
                if (disabled) return; // chặn chắc
                onChange(m.value);
              }}
              style={{ alignItems: "center", width: "18%" }}
              activeOpacity={disabled ? 1 : 0.85} // bị khóa thì không “nhấp nháy”
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: active ? activeColor : "#6b7280",
                  backgroundColor: active
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(255,255,255,0.04)",
                }}
              >
                <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
              </View>

              <Text
                numberOfLines={1}
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: active ? "white" : "#d1d5db",
                  fontWeight: active ? "700" : "500",
                  textAlign: "center",
                }}
              >
                {m.label}
              </Text>

              <Text style={{ marginTop: 2, fontSize: 11, color: "#9ca3af" }}>
                {m.value}/10
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  //   useEffect(() => {
  //   (async () => {
  //     try {
  //       await AsyncStorage.removeItem(RATINGS_KEY);
  //       console.log("✅ Cleared all local ratings:", RATINGS_KEY);
  //     } catch (e) {
  //       console.log("❌ Clear all local ratings error:", e);
  //     }
  //   })();
  // }, []);

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
        if (!cancelled && detail) setMovie((prev) => ({ 
          ...prev, 
          ...detail, 
          voteAverage: detail?.voteAverage ?? prev?.voteAverage,
          voteCount: detail?.voteCount ?? prev?.voteCount,}));

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
        console.log("Load movie error:", e?.message || e);
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

  //  Recently seen
  useEffect(() => {
    if (!movieId) return;
    // lưu bản movie hiện tại (sau khi fetch có thể đầy đủ hơn)
    saveToRecentlySeen({ ...movie, _id: movieId });
  }, [movieId, movie?.title, movie?.posterUrl]); // tránh chạy quá nhiều lần

  // 3) Similar movies
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!movieId) return;

      try {
        const res = await fetchSimilarMovies(movieId, 10);
        if (!cancelled) setSimilarMovies(res?.results || []);
      } catch (e) {
        console.log("Load similar movies error:", e?.message || e);
        if (!cancelled) setSimilarMovies([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  useEffect(() => {
    setMovie(initialMovie);
  }, [initialMovie]);

  useEffect(() => {

    // reset 
    setHasRated(false);
    setMyRating(10);
    setMyReview("");

    // load khi movieId hợp lệ
    if (movieId) loadMyRating(movieId);
  }, [movieId]);

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

  async function loadMyRating(id) {
    try {
      if (!id) {
        setHasRated(false);
        setMyRating(10);
        setMyReview("");
        return;
      }

      const raw = await AsyncStorage.getItem(RATINGS_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      const mine = obj?.[id];

      if (!mine) {
        setHasRated(false);
        setMyRating(10);
        setMyReview("");
        return;
      }

      setMyRating(mine?.rating ?? 10);
      setMyReview(typeof mine?.review === "string" ? mine.review : "");

      const submitted = mine?.submitted === true;
      setHasRated(submitted);

      console.log("loadMyRating:", { id, mine, submitted, keys: Object.keys(obj) });
    } catch (e) {
      console.log("Load my rating error:", e);
      setHasRated(false);
      setMyRating(10);
      setMyReview("");
    }
  }

  async function saveMyRating(id, patch) {
    try {
      if (!id) return; // chặn lưu vào "undefined"

      const raw = await AsyncStorage.getItem(RATINGS_KEY);
      const obj = raw ? JSON.parse(raw) : {};
      const prev = obj[id] || {};

      obj[id] = {
        ...prev,
        ...patch,
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(obj));
    } catch (e) {
      console.log("Save my rating error:", e);
    }
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

        {/* COUNTRY */}
        <View className="mx-4 mt-2">
          <Text className="text-white text-lg font-semibold mb-2">Quốc gia</Text>

          {Array.isArray(movie?.productionCountries) && movie.productionCountries.length > 0 ? (
            <Text className="text-neutral-300">
              {movie.productionCountries
                .map((c) => (typeof c === "string" ? c : c?.name || c?.code))
                .filter(Boolean)
                .join(", ")}
            </Text>
          ) : (
            <Text className="text-neutral-500">Chưa có dữ liệu quốc gia</Text>
          )}
        </View>

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
                    <Image source={{ uri: avatar }} style={{ width: 80, height: 80, borderRadius: 40 }} />
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

        {/* SIMILAR MOVIES */}
        <View className="mx-4 mt-6">
          <Text className="text-white text-lg font-semibold mb-2">Phim tương tự</Text>

          {Array.isArray(similarMovies) && similarMovies.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarMovies.map((sm, idx) => {
                const key = sm?._id || sm?.id || idx;
                const poster = sm?.posterUrl || "https://via.placeholder.com/185x278?text=No+Image";
                const title = sm?.title || "N/A";

                return (
                  <TouchableOpacity
                    key={key}
                    className="mr-3"
                    onPress={() => navigation.push("Movie", sm)}
                  >
                    <Image
                      source={{ uri: poster }}
                      style={{ width: 120, height: 180, borderRadius: 16 }}
                    />
                    <Text
                      className="text-neutral-200 mt-2"
                      numberOfLines={1}
                      style={{ width: 120 }}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text className="text-neutral-500">Chưa có phim tương tự</Text>
          )}
        </View>

        {/* RATING (thang 10) */}
        <View className="mx-4 mt-6" style={{ padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#262626" }}>
          <Text className="text-white text-lg font-semibold mb-2">Đánh giá phim</Text>

          <Text className="text-neutral-300 mb-2">
            Điểm hiện tại:{" "}
            <Text className="text-white font-bold">
              {Number.isFinite(Number(movie?.voteAverage)) ? Number(movie.voteAverage).toFixed(1) : "0.0"}
            </Text>
            /10{" "}
            {movie?.voteCount ? <Text className="text-neutral-500">({movie.voteCount} lượt)</Text> : null}
          </Text>

          <Text className="text-neutral-400 mb-2">
            Bạn chấm: <Text className="text-white font-bold">{myRating || 0}</Text>/10{" "}
            {!!myRating && <Text className="text-neutral-500">({getMilestoneLabel(myRating)})</Text>}
          </Text>

          <FiveMilestoneTenPicker
            value={myRating}
            disabled={hasRated || submitting}   // khóa nếu đã submit
            activeColor={theme?.background || "#ef4444"}
            onChange={async (val) => {
              if (!movieId) return; 
              setMyRating(val);
              await saveMyRating(movieId, { rating: val, review: myReview });
            }}
          />

          {/* Optional: review */}
          <View style={{ marginTop: 12 }}>
            <Text className="text-neutral-400 mb-2">Nhận xét (tuỳ chọn)</Text>
            <TextInput
              editable={!hasRated}
              value={myReview}
              onChangeText={setMyReview}
              placeholder="Viết vài dòng cảm nhận..."
              placeholderTextColor="#737373"
              multiline
              style={{
                minHeight: 70,
                color: "white",
                borderWidth: 1,
                borderColor: "#404040",
                borderRadius: 12,
                padding: 10,
              }}
              onBlur={async () => {
                if (!movieId) return;
                if (hasRated) return;
                // lưu review khi rời ô nhập
                await saveMyRating(movieId, { rating: myRating, review: myReview });
              }}
            />

            <TouchableOpacity
              disabled={hasRated}   // khóa nếu đã submit
              onPress={async () => {
                if (!movieId || hasRated || submitting) return;

                try {
                  setSubmitting(true);

                  console.log("POST /api/ratings payload:", { movieId, rating: myRating, review: myReview });

                  const rs = await postRating({
                    movieId,
                    rating: myRating,
                    review: myReview,
                  });

                  console.log("POST rating response:", rs);

                  // update UI ngay theo summary server
                  const summary = rs?.summary || {};
                  setMovie((prev) => ({
                    ...prev,
                    voteAverage: summary.avgRating ?? prev.voteAverage,
                    voteCount: summary.ratingCount ?? prev.voteCount,
                  }));

                  setHasRated(true);

                  // vẫn lưu local để nhớ trạng thái đã rate
                  await saveMyRating(movieId, { rating: myRating, review: myReview, submitted: true });
                } catch (e) {
                  console.log("Rate error:", e?.message || e);
                } finally {
                  setSubmitting(false);
                }
              }}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: theme?.background || "#ef4444",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Lưu đánh giá</Text>
            </TouchableOpacity>
          </View>
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
            console.log("Phim này chưa có videoUrl:", movie?.title);
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
