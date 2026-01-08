import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchUpcomingMovies } from "../api/moviedb";
import { Bars3CenterLeftIcon } from "react-native-heroicons/outline";
import Loading from "../components/loading";

const { width } = Dimensions.get("window");

export default function UpcomingScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // normalize response: có thể API trả [] hoặc {results: []}
  const normalizeList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  };

  const formatDate = (d) => {
    if (!d) return "No release date available";
    // d có thể là ISO string: "2010-07-16T00:00:00.000Z"
    const s = typeof d === "string" ? d : String(d);
    return s.includes("T") ? s.slice(0, 10) : s; // yyyy-mm-dd
  };

  useEffect(() => {
    let mounted = true;

    const loadMovies = async () => {
      try {
        const data = await fetchUpcomingMovies();
        const list = normalizeList(data);

        // nếu BE chưa filter upcoming, bạn có thể lọc tại client:
        // const listUpcoming = list.filter(m => m?.status === "Upcoming");
        // if (mounted) setMovies(listUpcoming);

        if (mounted) setMovies(list);
      } catch (error) {
        console.error("Failed to fetch upcoming movies:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadMovies();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loading />;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Bars3CenterLeftIcon size={40} strokeWidth={2} color="red" />
        </TouchableOpacity>
        <Text style={styles.title}>Upcoming Movies</Text>
      </View>

      {/* Danh sách phim */}
      {movies.length > 0 ? (
        movies.map((item, index) => {
          const key = String(item?._id ?? item?.id ?? index);

          // BE của bạn trả posterUrl như: http://10.0.2.2:5000/uploads/posters/avatar_3.jpg
          const posterUri = item?.posterUrl ?? null;

          return (
            <View key={key} style={styles.movieItem}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Movie", item)}
                style={styles.movieContent}
              >
                <Image
                  source={{ uri: posterUri }}
                  style={styles.movieImage}
                  onError={(e) =>
                    console.log("Poster error:", item?.title, posterUri, e.nativeEvent)
                  }
                />

                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{item?.title}</Text>
                  <Text style={styles.movieDate}>
                    {formatDate(item?.releaseDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No upcoming movies available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
  },
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 10,
  },
  movieContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#0b1220",
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
  },
  movieTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  movieDate: {
    color: "#94a3b8",
    fontSize: 14,
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
