import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles, theme } from "../theme";
import Loading from "../components/loading";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fallbackPersonImage,
  fetchSimilarMovies,
  postRating,
  fetchMovieComments,

  // thêm các API này (tự implement trong ../api/moviedb)
  fetchMe,
  getFavoriteStatus,
  toggleFavorite,
  postRecentlySeen,
} from "../api/moviedb";

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
  const [loading, setLoading] = useState(true);

  // tất cả từ API
  const [me, setMe] = useState({ userId: null, user: null });
  const [isFavourite, setIsFavourite] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);

  // form rating/comment
  const [myRating, setMyRating] = useState(10);
  const [savedRating, setSavedRating] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);

  // list comments
  const [commentText, setCommentText] = useState("");
  const [savedCommentText, setSavedCommentText] = useState(""); // comment đã lưu trên server
  const [submittingComment, setSubmittingComment] = useState(false);

  // comments list
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [myCommentId, setMyCommentId] = useState(null);

  const busy = submittingRating || submittingComment;

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
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {FIVE_MILESTONES.map((m) => {
          const active = m.value === value;

          return (
            <TouchableOpacity
              key={m.value}
              disabled={disabled}
              onPress={() => {
                if (disabled) return;
                onChange(m.value);
              }}
              style={{ alignItems: "center", width: "18%" }}
              activeOpacity={disabled ? 1 : 0.85}
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

  const normalizeComments = useCallback((rs) => {
    const list = rs?.results || rs?.data || rs?.comments || rs || [];
    return Array.isArray(list) ? list : [];
  }, []);

  const isMyComment = useCallback(
    (c) => {
      const cid = c?._id || c?.id;
      if (myCommentId && cid && String(cid) === String(myCommentId)) return true;

      const uid = c?.userId || c?.user?._id || c?.user?.id;
      if (me?.userId && uid && String(uid) === String(me.userId)) return true;

      const uname = c?.user?.name || c?.user;
      if (me?.user && uname) {
        return String(uname).toLowerCase() === String(me.user).toLowerCase();
      }
      return false;
    },
    [me?.user, me?.userId, myCommentId]
  );

  const refreshComments = useCallback(async () => {
    if (!movieId) return;

    setLoadingComments(true);
    try {
      const rs = await fetchMovieComments(movieId);
      const rawArr = normalizeComments(rs);

      // tìm comment của mình => fill lên form
      const mine = rawArr.find((c) => {
        const uid = c?.userId || c?.user?._id || c?.user?.id;
        if (me?.userId && uid && String(uid) === String(me.userId)) return true;

        const uname = c?.user?.name || c?.user;
        if (me?.user && uname) {
          return String(uname).toLowerCase() === String(me.user).toLowerCase();
        }
        return false;
      });

      if (mine) {
        setMyCommentId(mine?._id || mine?.id || null);
        const r = mine?.rating;
        const rNum = Number.isFinite(Number(r)) ? Number(r) : null;
        setSavedRating(rNum);
        setMyRating(rNum ?? 10); // đồng bộ picker theo điểm đã lưu
        const mineText =
          typeof mine?.review === "string"
            ? mine.review
            : mine?.comment || mine?.content || "";
        setSavedCommentText(mineText || "");
        setCommentText(mineText || "");
      } else {
        setMyCommentId(null);
        setSavedRating(null);
        setSavedCommentText("");
        setCommentText("");
      }
       // chỉ hiển thị comment có nội dung (rating-only không hiện ở list)
      const visible = rawArr.filter((c) => {
        const content = c?.review || c?.comment || c?.content || "";
        return String(content).trim().length > 0;
      });
      setComments(visible);
    } catch (e) {
      console.log("Load comments error:", e?.message || e);
      setComments([]);
      setMyCommentId(null);
      setSavedRating(null);
      setSavedCommentText("");
      setCommentText("");
    } finally {
      setLoadingComments(false);
    }
  }, [movieId, me?.userId, me?.user, normalizeComments]);

  // 2 handlers riêng
  const handleSubmitRating = useCallback(async () => {
    if (!movieId || busy) return;
    try {
      setSubmittingRating(true);

      // gửi rating, giữ comment cũ để tránh bị wipe nếu backend update cả review
      const rs = await postRating({
        movieId,
        rating: myRating,
        review: savedCommentText || undefined, // undefined sẽ không gửi trong JSON
      });

      const summary = rs?.summary || {};
      setMovie((prev) => ({
        ...prev,
        voteAverage: summary.avgRating ?? prev.voteAverage,
        voteCount: summary.ratingCount ?? prev.voteCount,
      }));

      setSavedRating(myRating);
    } catch (e) {
      console.log("Rating error:", e?.message || e);
    } finally {
      setSubmittingRating(false);
    }
  }, [movieId, myRating, savedCommentText, busy]);

  const handleSubmitComment = useCallback(async () => {
    if (!movieId || busy) return;
    const text = String(commentText || "").trim();
    if (!text) return;

    try {
      setSubmittingComment(true);

      // comment không tự “đổi điểm” nếu bạn đã lưu rating trước đó
      const ratingToSend = savedRating != null ? savedRating : myRating;

      const rs = await postRating({
        movieId,
        rating: ratingToSend,
        review: text,
      });

      const summary = rs?.summary || {};
      setMovie((prev) => ({
        ...prev,
        voteAverage: summary.avgRating ?? prev.voteAverage,
        voteCount: summary.ratingCount ?? prev.voteCount,
      }));

      setSavedCommentText(text);
      await refreshComments();
    } catch (e) {
      console.log("Comment error:", e?.message || e);
    } finally {
      setSubmittingComment(false);
    }
  }, [movieId, commentText, savedRating, myRating, busy, refreshComments]);

  // ✅ 0) ME từ API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rs = await fetchMe();
        if (cancelled) return;

        const userId =
          rs?.userId || rs?._id || rs?.id || rs?.user?._id || rs?.user?.id;
        const user =
          rs?.user || rs?.username || rs?.name || rs?.user?.name || null;

        setMe({
          userId: userId ? String(userId) : null,
          user: user ? String(user) : null,
        });
      } catch (e) {
        if (!cancelled) setMe({ userId: null, user: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ 1) Movie detail + credits từ API
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const detail = await fetchMovieDetails(movieId);
        if (!cancelled && detail) {
          setMovie((prev) => ({
            ...prev,
            ...detail,
            voteAverage: detail?.voteAverage ?? prev?.voteAverage,
            voteCount: detail?.voteCount ?? prev?.voteCount,
          }));
        }

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

  // ✅ 2) Favorite status từ API
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!movieId) return;
      try {
        const rs = await getFavoriteStatus(movieId);
        if (cancelled) return;
        const fav =
          rs?.isFavourite ?? rs?.favorited ?? rs?.favorite ?? rs?.liked;
        setIsFavourite(Boolean(fav));
      } catch (e) {
        // fail thì thôi, không crash UI
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  // ✅ 3) RecentlySeen log từ API
  useEffect(() => {
    (async () => {
      if (!movieId) return;
      try {
        await postRecentlySeen({ movieId });
      } catch (e) {}
    })();
  }, [movieId]);

  // ✅ 4) Similar từ API
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!movieId) return;
      try {
        const res = await fetchSimilarMovies(movieId, 10);
        if (!cancelled) setSimilarMovies(res?.results || []);
      } catch (e) {
        if (!cancelled) setSimilarMovies([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  // ✅ 5) Comments từ API
  useEffect(() => {
    if (!movieId) return;
    refreshComments();
  }, [movieId, me?.userId, me?.user, refreshComments]);

  // params đổi thì update nhanh (không phải local storage)
  useEffect(() => {
    setMovie(initialMovie);
  }, [initialMovie]);

  async function handleToggleFavorite() {
    if (!movieId) return;
    try {
      const rs = await toggleFavorite(movieId);
      const fav =
        rs?.isFavourite ?? rs?.favorited ?? rs?.favorite ?? rs?.liked;
      setIsFavourite(typeof fav === "boolean" ? fav : !isFavourite);
    } catch (e) {
      console.log("toggleFavorite error:", e?.message || e);
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
              {similarMovies
                .filter((m) => String(m?._id || m?.id || "") !== String(movieId)) // tránh hiện chính nó
                .slice(0, 15)
                .map((m, idx) => {
                  const key = m?._id || m?.id || idx;

                  const poster =
                    m?.posterUrl ||
                    m?.posterPath ||
                    m?.poster ||
                    "https://via.placeholder.com/500x750?text=No+Image";

                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => navigation.push("Movie", m)} // mở movie detail mới
                      style={{ marginRight: 12, width: 120 }}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={{ uri: poster }}
                        style={{ width: 120, height: 180, borderRadius: 12 }}
                      />
                      <Text
                        className="text-neutral-200 mt-2"
                        numberOfLines={2}
                        style={{ fontSize: 13, fontWeight: "600" }}
                      >
                        {m?.title || "N/A"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          ) : (
            <Text className="text-neutral-500">Chưa có phim tương tự</Text>
          )}
        </View>

        {/* RATING */}
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
            disabled={busy}
            activeColor={theme?.background || "#ef4444"}
            onChange={(val) => setMyRating(val)}
          />
          {/* Nút lưu rating */}
          <TouchableOpacity
            disabled={busy}
            onPress={handleSubmitRating}
            style={{
              marginTop: 10,
              paddingVertical: 10,
              borderRadius: 12,
              alignItems: "center",
              backgroundColor: theme?.background || "#ef4444",
              opacity: busy ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {submittingRating ? "Đang lưu..." : "Lưu đánh giá"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* COMMENTS */}
        <View className="mx-4 mt-4" style={{ padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#262626" }}>
          <Text className="text-white text-lg font-semibold mb-2">Bình luận</Text>

          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            editable={!busy}
            placeholder="Viết bình luận của bạn..."
            placeholderTextColor="#737373"
            multiline
            style={{ minHeight: 80, color: "white", borderWidth: 1, borderColor: "#404040", borderRadius: 12, padding: 10 }}
          />

          <TouchableOpacity
            disabled={busy || String(commentText || "").trim().length === 0}
            onPress={handleSubmitComment}
            style={{ marginTop: 10, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: theme?.background || "#ef4444" }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {submittingComment ? "Đang gửi..." : (myCommentId ? "Cập nhật bình luận" : "Gửi bình luận")}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 14 }}>
            {loadingComments ? (
              <Text className="text-neutral-400">Đang tải bình luận...</Text>
            ) : comments?.length > 0 ? (
              comments.map((c, idx) => {
                const cid = c?._id || c?.id || idx;
                const uname = c?.user?.name || c?.user || "Ẩn danh";
                const content = c?.review || c?.comment || c?.content || "";
                const point = c?.rating ?? null;
                const time = c?.updatedAt || c?.createdAt;
                const mine = isMyComment(c);

                return (
                  <View key={cid} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#262626" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "white", fontWeight: "700" }}>
                        {uname} {mine ? <Text style={{ color: "#9ca3af" }}>(bạn)</Text> : null}
                      </Text>
                      <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                        {time ? new Date(time).toLocaleString("vi-VN") : ""}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                      {point != null ? (
                        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: "#374151", marginRight: 8 }}>
                          <Text style={{ color: "white", fontWeight: "700" }}>{point}/10</Text>
                        </View>
                      ) : null}
                      <Text style={{ color: "#e5e7eb", flex: 1 }}>{content || "—"}</Text>
                    </View>

                    {mine ? (
                      <TouchableOpacity
                        onPress={() => {
                          setCommentText(typeof c?.review === "string" ? c.review : c?.comment || c?.content || "");
                          setMyCommentId(c?._id || c?.id || null);
                        }}
                        style={{ marginTop: 8 }}
                      >
                        <Text style={{ color: theme?.background || "#ef4444", fontWeight: "700" }}>
                          Sửa bình luận
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })
            ) : (
              <Text className="text-neutral-500">Chưa có bình luận nào</Text>
            )}
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
          if (!videoId) return;
          navigation.navigate("Trailer", { videoId });
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>▶</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}