// import React, { useCallback, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { XMarkIcon } from "react-native-heroicons/outline";
// import { useNavigation } from "@react-navigation/native";
// import { fallbackMoviePoster, image185, searchMovies, fetchTrendingMovies } from "../api/moviedb";
// import { debounce } from "lodash";
// import Loading from "../components/loading";

// const { width, height } = Dimensions.get("window");

// export default function SearchScreen() {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Hàm load phim dựa theo query và trang
//   const loadMovies = async (pageNum, query) => {
//     setLoading(true);
//     let data;
//     if (query && query.trim().length > 0) {
//       data = await searchMovies({
//         query: query,
//         include_adult: false,
//         language: "en-US",
//         page: pageNum.toString(),
//       });
//     } else {
//       data = await fetchTrendingMovies(); // default trending movies nếu query trống
//     }
//     setLoading(false);
//     if (data && data.results) {
//       if (pageNum === 1) {
//         setResults(data.results);
//       } else {
//         setResults((prev) => [...prev, ...data.results]);
//       }
//       setPage(pageNum);
//       setTotalPages(data.total_pages || 1);
//     }
//   };

//   // Khi component mount, load default movies (trending)
//   useEffect(() => {
//     loadMovies(1, "");
//   }, []);

//   // Khi người dùng nhập từ khóa tìm kiếm
//   const handleSearchText = (text) => {
//     setSearchQuery(text);
//     loadMovies(1, text);
//   };

//   const handleLoadMore = () => {
//     if (page < totalPages) {
//       loadMovies(page + 1, searchQuery);
//     }
//   };

//   const handleTextDebounce = useCallback(debounce(handleSearchText, 400), []);

//   return (
//     <SafeAreaView className="bg-neutral-800 flex-1">
//       {/* Search input */}
//       <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
//         <TextInput
//           onChangeText={handleTextDebounce}
//           placeholder="Search Movie"
//           placeholderTextColor={"lightgray"}
//           className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
//           defaultValue={searchQuery}
//         />
//         <TouchableOpacity
//           onPress={() => navigation.navigate("Home")}
//           className="rounded-full p-3 m-1 bg-neutral-500"
//         >
//           <XMarkIcon size="25" color="white" />
//         </TouchableOpacity>
//       </View>
      
//       {/* Search results */}
//       {loading && page === 1 ? (
//         <Loading />
//       ) : (
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 15 }}
//           className="space-y-3"
//         >
//           {results.length > 0 && (
//             <Text className="text-white font-semibold ml-1">
//               Results ({results.length})
//             </Text>
//           )}
//           <View className="flex-row justify-between flex-wrap">
//             {results.map((item, index) => (
//               <TouchableWithoutFeedback
//                 key={index}
//                 onPress={() => navigation.push("Movie", item)}
//               >
//                 <View className="space-y-2 mb-4">
//                   <Image
//                     source={{
//                       uri:
//                         image185(item.poster_path) || fallbackMoviePoster,
//                     }}
//                     className="rounded-3xl"
//                     style={{
//                       width: width * 0.44,
//                       height: height * 0.3,
//                     }}
//                   />
//                   <Text className="text-gray-300 ml-1">
//                     {item.title.length > 22
//                       ? item.title.slice(0, 22) + "..."
//                       : item.title}
//                   </Text>
//                 </View>
//               </TouchableWithoutFeedback>
//             ))}
//           </View>
//           {page < totalPages && (
//             <TouchableOpacity
//               onPress={handleLoadMore}
//               className="bg-neutral-500 py-2 px-4 rounded-full self-center mb-4"
//             >
//               <Text className="text-white font-semibold">Load More</Text>
//             </TouchableOpacity>
//           )}
//           {results.length === 0 && !loading && (
//             <View className="flex-row justify-center">
//               <Image
//                 source={require("../assets/images/movieTime.png")}
//                 className="h-96 w-96"
//               />
//             </View>
//           )}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import Loading from "../components/loading";

// Giữ import này để bạn không phải đổi file api đang dùng
import {
  fallbackMoviePoster,
  image185,
  searchMovies,
  fetchTrendingMovies,
} from "../api/moviedb";

const { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // chống case request cũ về trễ ghi đè request mới
  const requestIdRef = useRef(0);

  const normalizeResponse = (data) => {
    // BE của bạn có thể trả mảng trực tiếp: [...]
    if (Array.isArray(data)) {
      return { list: data, total: 1 };
    }

    // TMDB: { results, total_pages }
    if (data?.results && Array.isArray(data.results)) {
      return { list: data.results, total: data.total_pages || 1 };
    }

    // Một số BE hay trả { data: [], totalPages: n }
    if (data?.data && Array.isArray(data.data)) {
      return { list: data.data, total: data.totalPages || 1 };
    }

    return { list: [], total: 1 };
  };

  const getPosterUri = (item) => {
    // Ưu tiên đồ án hiện tại của bạn
    if (item?.posterUrl) return item.posterUrl;

    // Fallback cho TMDB
    if (item?.poster_path) return image185(item.poster_path);

    return fallbackMoviePoster;
  };

  const getTitleText = (item) => {
    const title = item?.title || item?.name || "Untitled";

    // releaseDate (ISO) từ MongoDB / BE
    let year = "";
    if (item?.releaseDate) {
      const d = new Date(item.releaseDate);
      if (!Number.isNaN(d.getTime())) year = String(d.getFullYear());
    }

    // release_date (TMDB)
    if (!year && item?.release_date) {
      year = String(item.release_date).slice(0, 4);
    }

    return year ? `${title} (${year})` : title;
  };

  const loadMovies = useCallback(async (pageNum, query) => {
    const requestId = ++requestIdRef.current;

    const isFirstPage = pageNum === 1;
    if (isFirstPage) setLoading(true);
    else setLoadingMore(true);

    try {
      let raw;

      if (query && query.trim().length > 0) {
        // Nếu file api của bạn hiện vẫn theo kiểu TMDB: searchMovies({ query, page })
        // thì đoạn này vẫn chạy được.
        raw = await searchMovies({
          query: query.trim(),
          page: String(pageNum),
        });
      } else {
        // default: trending / list phim của đồ án
        raw = await fetchTrendingMovies();
      }

      // Nếu có request mới hơn thì bỏ qua kết quả cũ
      if (requestId !== requestIdRef.current) return;

      const { list, total } = normalizeResponse(raw);

      setTotalPages(total || 1);
      setPage(pageNum);

      if (isFirstPage) {
        setResults(list);
      } else {
        // tránh duplicate theo _id / id nếu có
        setResults((prev) => {
          const seen = new Set(prev.map((m) => m?._id || m?.id));
          const merged = [...prev];
          for (const m of list) {
            const key = m?._id || m?.id || JSON.stringify(m);
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(m);
            }
          }
          return merged;
        });
      }
    } catch (e) {
      // nhẹ nhàng: nếu lỗi thì reset trang 1 cho đỡ rác UI
      if (pageNum === 1) setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Load default (trending/list) khi vào màn hình
  useEffect(() => {
    loadMovies(1, "");
  }, [loadMovies]);

  const debouncedSearch = useMemo(
    () =>
      debounce((text) => {
        loadMovies(1, text);
      }, 400),
    [loadMovies]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const onChangeSearch = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleLoadMore = () => {
    if (loadingMore) return;
    if (page < totalPages) {
      loadMovies(page + 1, searchQuery);
    }
  };

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      {/* Search input */}
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="rounded-full p-3 m-1 bg-neutral-500"
        >
          <XMarkIcon size="25" color="white" />
        </TouchableOpacity>
      </View>

      {/* Search results */}
      {loading && page === 1 ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
          className="space-y-3"
        >
          {results.length > 0 && (
            <Text className="text-white font-semibold ml-1">
              Results ({results.length})
            </Text>
          )}

          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => (
              <TouchableWithoutFeedback
                key={item?._id?.toString?.() || item?.id?.toString?.() || index}
                onPress={() => navigation.push("Movie", item)}
              >
                <View className="space-y-2 mb-4">
                  <Image
                    source={{ uri: getPosterUri(item) }}
                    className="rounded-3xl"
                    style={{
                      width: width * 0.44,
                      height: height * 0.3,
                    }}
                  />
                  <Text className="text-gray-300 ml-1">
                    {getTitleText(item).length > 22
                      ? getTitleText(item).slice(0, 22) + "..."
                      : getTitleText(item)}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>

          {/* Load more */}
          {page < totalPages && results.length > 0 && (
            <TouchableOpacity
              onPress={handleLoadMore}
              disabled={loadingMore}
              className="bg-neutral-500 py-2 px-4 rounded-full self-center mb-2"
            >
              {loadingMore ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-white font-semibold">Load More</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Empty state */}
          {results.length === 0 && !loading && (
            <View className="flex-row justify-center">
              <Image
                source={require("../assets/images/movieTime.png")}
                className="h-96 w-96"
              />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
