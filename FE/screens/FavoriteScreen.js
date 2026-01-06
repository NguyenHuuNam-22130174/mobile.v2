import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    StyleSheet,
    Modal,
    Pressable,
} from "react-native";
import { fetchFavorites, deleteFavorite } from "../api/moviedb";
import { useNavigation } from "@react-navigation/native";
import { Bars3CenterLeftIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from "@react-navigation/native";  

export default function FavoriteScreen() {
    const [favorites, setFavorites] = useState([]);
    const navigation = useNavigation();

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null); // movie object hoặc id
    const [deleting, setDeleting] = useState(false);

    const openDeletePopup = (movie) => {
        setPendingDelete(movie);
        setConfirmVisible(true);
    };

    const closeDeletePopup = () => {
        if (deleting) return;
        setConfirmVisible(false);
        setPendingDelete(null);
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;

        const movieId = pendingDelete?._id || pendingDelete?.id;
        if (!movieId) return;

        try {
            setDeleting(true);
            await deleteFavorite(movieId);

            setFavorites((prev) =>
                prev.filter((m) => String(m?._id || m?.id) !== String(movieId))
            );

            closeDeletePopup();
        } catch (e) {
            console.log("Delete favorite error:", e?.message || e);
        } finally {
            setDeleting(false);
        }
    };

    // Load danh sách yêu thích
    useFocusEffect(
        useCallback(() => {
            let alive = true;

            const loadFavorites = async () => {
                try {
                    const movies = await fetchFavorites();
                    if (alive) setFavorites(movies);
                } catch (e) {
                    console.log("Load favorites error:", e?.message || e);
                    if (alive) setFavorites([]);
                }
            };

            loadFavorites();
            return () => {
                alive = false;
            };
        }, [])
    );

    // Hàm xóa phim khỏi danh sách yêu thích
    // const removeFavorite = async (movieId) => {
    //     Alert.alert(
    //         "Confirm",
    //         "Are you sure you want to remove this movie from your favorites?",
    //         [
    //             { text: "Cancel", style: "cancel" },
    //             {
    //                 text: "Confirm",
    //                 style: "destructive",
    //                 onPress: async () => {
    //                     try {
    //                         await deleteFavorite(movieId);
    //                         setFavorites((prev) =>
    //                             prev.filter((m) => String(m?._id || m?.id) !== String(movieId))
    //                         );
    //                     } catch (e) {
    //                         console.log("Delete favorite error:", e?.message || e);
    //                     }
    //                 },
    //             },
    //         ]
    //     );
    // };

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
                favorites.map((item) => {
                    const id = item?._id || item?.id;
                    const poster =
                        item?.posterUrl ||
                        item?.poster_path ||
                        "https://via.placeholder.com/500x750?text=No+Image";

                    return (
                        <View key={String(id)} style={styles.movieItem}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("Movie", item)}>
                                <View style={styles.movieContent}>
                                    <Image source={{ uri: item.posterUrl }} style={styles.movieImage} onError={() => console.log("Poster load failed:", item.posterUrl)} />
                                    <Text style={styles.movieTitle}>{item?.title || "N/A"}</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableOpacity
                                onPress={() => openDeletePopup(item)}
                                style={styles.removeButton}
                            >
                                <XMarkIcon size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    );
                })
            ) : (
                <Text style={styles.emptyText}>Favorites list is empty</Text>
            )}

            {/* CONFIRM DELETE MODAL */}
            <Modal
                visible={confirmVisible}
                transparent
                animationType="fade"
                onRequestClose={closeDeletePopup}
            >
                <Pressable style={styles.modalBackdrop} onPress={closeDeletePopup}>
                    <Pressable style={styles.modalCard} onPress={() => { }}>
                        <Text style={styles.modalTitle}>Xoá khỏi yêu thích?</Text>

                        <Text style={styles.modalDesc}>
                            Bạn có chắc muốn xoá{" "}
                            <Text style={{ fontWeight: "700", color: "white" }}>
                                {pendingDelete?.title || "phim này"}
                            </Text>{" "}
                            khỏi danh sách yêu thích không?
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                disabled={deleting}
                                onPress={closeDeletePopup}
                                style={[styles.modalBtn, styles.modalBtnCancel, deleting && { opacity: 0.6 }]}
                            >
                                <Text style={styles.modalBtnText}>Huỷ</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={deleting}
                                onPress={confirmDelete}
                                style={[styles.modalBtn, styles.modalBtnDanger, deleting && { opacity: 0.6 }]}
                            >
                                <Text style={[styles.modalBtnText, { color: "white" }]}>
                                    {deleting ? "Đang xoá..." : "Xoá"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
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

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.55)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalCard: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#0b1220",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#1f2937",
    },
    modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "800",
    },
    modalDesc: {
        marginTop: 10,
        color: "#cbd5e1",
        fontSize: 14,
        lineHeight: 20,
    },
    modalActions: {
        marginTop: 14,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    modalBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        minWidth: 90,
        alignItems: "center",
    },
    modalBtnCancel: {
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "#334155",
    },
    modalBtnDanger: {
        backgroundColor: "#ef4444",
    },
    modalBtnText: {
        color: "#e5e7eb",
        fontWeight: "800",
    },

});
