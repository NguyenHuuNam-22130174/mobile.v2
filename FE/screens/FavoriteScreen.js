import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { image185 } from "../api/moviedb";
import { Bars3CenterLeftIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from "@react-navigation/native";  

export default function FavoriteScreen() {
    const [favorites, setFavorites] = useState([]);
    const navigation = useNavigation();

    // Load danh sách yêu thích
    useFocusEffect(
        React.useCallback(() => {
          const loadFavorites = async () => {
            const fav = await AsyncStorage.getItem("favorites");
            if (fav) setFavorites(JSON.parse(fav));
          };
          loadFavorites();
        }, [])
      );

    // Hàm xóa phim khỏi danh sách yêu thích
    const removeFavorite = async (movieId) => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to remove this movie from your favorites?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: async () => {
                        const updatedFavorites = favorites.filter(
                            item => item.id !== movieId
                        );
                        await AsyncStorage.setItem(
                            "favorites",
                            JSON.stringify(updatedFavorites)
                        );
                        setFavorites(updatedFavorites);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Favorite Movies</Text>
            </View>

            {/* Danh sách phim */}
            {favorites.length > 0 ? (
                favorites.map((item) => (
                    <View key={item.id} style={styles.movieItem}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("Movie", item)}
                        >
                            <View style={styles.movieContent}>
                                <Image
                                    source={{ uri: image185(item.poster_path) }}
                                    style={styles.movieImage}
                                />
                                <Text style={styles.movieTitle}>{item.title}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableOpacity
                            onPress={() => removeFavorite(item.id)}
                            style={styles.removeButton}
                        >
                            <XMarkIcon size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.emptyText}>Favorites list is empty</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    movieItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        backgroundColor: '#1e293b',
        borderRadius: 10,
        padding: 10,
    },
    movieContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    movieTitle: {
        color: 'white',
        fontSize: 16,
        marginLeft: 12,
        flexShrink: 1,
    },
    removeButton: {
        padding: 8,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
