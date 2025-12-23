import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185, searchMovies, fetchTrendingMovies } from "../api/moviedb";
import { debounce } from "lodash";
import Loading from "../components/loading";

const { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm load phim dựa theo query và trang
  const loadMovies = async (pageNum, query) => {
    setLoading(true);
    let data;
    if (query && query.trim().length > 0) {
      data = await searchMovies({
        query: query,
        include_adult: false,
        language: "en-US",
        page: pageNum.toString(),
      });
    } else {
      data = await fetchTrendingMovies(); // default trending movies nếu query trống
    }
    setLoading(false);
    if (data && data.results) {
      if (pageNum === 1) {
        setResults(data.results);
      } else {
        setResults((prev) => [...prev, ...data.results]);
      }
      setPage(pageNum);
      setTotalPages(data.total_pages || 1);
    }
  };

  // Khi component mount, load default movies (trending)
  useEffect(() => {
    loadMovies(1, "");
  }, []);

  // Khi người dùng nhập từ khóa tìm kiếm
  const handleSearchText = (text) => {
    setSearchQuery(text);
    loadMovies(1, text);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      loadMovies(page + 1, searchQuery);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearchText, 400), []);

  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      {/* Search input */}
      <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
          defaultValue={searchQuery}
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
          contentContainerStyle={{ paddingHorizontal: 15 }}
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
                key={index}
                onPress={() => navigation.push("Movie", item)}
              >
                <View className="space-y-2 mb-4">
                  <Image
                    source={{
                      uri:
                        image185(item.poster_path) || fallbackMoviePoster,
                    }}
                    className="rounded-3xl"
                    style={{
                      width: width * 0.44,
                      height: height * 0.3,
                    }}
                  />
                  <Text className="text-gray-300 ml-1">
                    {item.title.length > 22
                      ? item.title.slice(0, 22) + "..."
                      : item.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          {page < totalPages && (
            <TouchableOpacity
              onPress={handleLoadMore}
              className="bg-neutral-500 py-2 px-4 rounded-full self-center mb-4"
            >
              <Text className="text-white font-semibold">Load More</Text>
            </TouchableOpacity>
          )}
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
