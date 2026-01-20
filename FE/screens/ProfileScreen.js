import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation, DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bars3CenterLeftIcon } from "react-native-heroicons/outline";

import Loading from "../components/loading";
import { useTheme } from "../components/context/ThemeContext";
import { fetchMe, updateMe } from "../api/moviedb";

const ios = Platform.OS === "ios";
const HEADER_HEIGHT = ios ? 60 : 70;

const fallbackAvatar = "https://i.imgur.com/8Km9tLL.png";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const HEADER_TOTAL = HEADER_HEIGHT + (insets?.top || 0);

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", avatarUrl: "" });

  // animation giống Home
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(-HEADER_HEIGHT)).current;
  const contentY = useRef(new Animated.Value(30)).current;

  const cardBg = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const mutedText = isDarkMode ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)";
  const inputBg = isDarkMode ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.06)";

  const startAnimations = useCallback(() => {
    Animated.timing(headerY, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: false,
      }),
      Animated.timing(contentY, {
        toValue: 0,
        duration: 800,
        delay: 150,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentY, fadeAnim, headerY]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const loadMe = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMe();
      setMe(data);

      setForm({
        name: data?.name || data?.fullName || "",
        phone: data?.phone || "",
        avatarUrl: data?.avatarUrl || data?.avatar || "",
      });
    } catch (e) {
      console.log("fetchMe error:", e?.response?.data || e?.message);
      Alert.alert("Lỗi", "Không lấy được thông tin tài khoản.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMe();
    }, [loadMe])
  );

  const avatar = useMemo(() => {
    const url = form.avatarUrl || me?.avatarUrl || me?.avatar;
    return url ? url : fallbackAvatar;
  }, [form.avatarUrl, me]);

  const onToggleEdit = useCallback(() => {
    // nếu đang edit mà bấm "Huỷ" -> trả form về data hiện tại
    if (editing) {
      setForm({
        name: me?.name || me?.fullName || "",
        phone: me?.phone || "",
        avatarUrl: me?.avatarUrl || me?.avatar || "",
      });
      setEditing(false);
    } else {
      setEditing(true);
    }
  }, [editing, me]);

  const onSave = useCallback(async () => {
    try {
      const payload = { name: form.name, phone: form.phone, avatarUrl: form.avatarUrl };
      const updated = await updateMe(payload);

      // updateMe có thể trả user hoặc {data:user} tuỳ bạn -> giữ an toàn
      const user = updated?.user || updated?.data || updated || null;
      if (user) setMe(user);

      setEditing(false);
      Alert.alert("OK", "Cập nhật thông tin thành công.");
    } catch (e) {
      console.log("updateMe error:", e?.response?.data || e?.message);
      Alert.alert("Lỗi", "Không cập nhật được. Kiểm tra lại API BE.");
    }
  }, [form]);

  if (loading) return <Loading />;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* HEADER giống Home */}
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
            <Bars3CenterLeftIcon size={28} strokeWidth={2} color={theme.colors.text} />
          </TouchableOpacity>

          <Text style={[styles.logo, { color: theme.colors.text }]}>
            <Text style={{ color: theme.colors.primary }}>M</Text>
            FLIX
          </Text>

          {/* Right action: Sửa / Lưu */}
          <TouchableOpacity
            onPress={editing ? onSave : onToggleEdit}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.headerActionText, { color: theme.colors.text }]}>
              {editing ? "Lưu" : "Sửa"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={ios ? "padding" : undefined}
        keyboardVerticalOffset={HEADER_TOTAL}  
        style={{ flex: 1 }}
        >
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"   
            contentContainerStyle={[styles.scrollContent, { paddingTop: HEADER_TOTAL + 16 }]}
        >
            {/* animate ở trong, KHÔNG animate ScrollView */}
            <Animated.View
            style={{
                opacity: fadeAnim,
                ...(Platform.OS === "ios" ? { transform: [{ translateY: contentY }] } : {}), 
            }}
            >
            {/* Profile card */}
            <View style={[styles.headerCard, { backgroundColor: cardBg }]}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                <Text style={[styles.nameText, { color: theme.colors.text }]}>
                    {me?.name || me?.fullName || "Chưa có tên"}
                </Text>
                <Text style={[styles.subText, { color: mutedText }]}>{me?.email || "—"}</Text>
                <Text style={[styles.subText, { color: mutedText }]}>
                    Username: {me?.username || me?.userName || "—"}
                </Text>
                </View>
            </View>

          {/* Info card */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.rowBetween}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Thông tin cá nhân
              </Text>

              <TouchableOpacity onPress={onToggleEdit} style={[styles.editBtn, { backgroundColor: cardBg }]}>
                <Text style={[styles.editBtnText, { color: theme.colors.text }]}>
                  {editing ? "Huỷ" : "Sửa"}
                </Text>
              </TouchableOpacity>
            </View>

            <Field
              label="Họ tên"
              value={form.name}
              editable={editing}
              onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
              themeText={theme.colors.text}
              mutedText={mutedText}
              inputBg={inputBg}
              isDarkMode={isDarkMode}
            />

            <Field
              label="Số điện thoại"
              value={form.phone}
              editable={editing}
              keyboardType="phone-pad"
              onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
              themeText={theme.colors.text}
              mutedText={mutedText}
              inputBg={inputBg}
              isDarkMode={isDarkMode}
            />

            {!editing ? (
              <View style={[styles.infoBox, { backgroundColor: inputBg }]}>
                <Text style={[styles.infoText, { color: mutedText }]}>
                  ID: {me?._id || me?.id || "—"}
                </Text>
                <Text style={[styles.infoText, { color: mutedText }]}>
                  Created: {me?.createdAt || "—"}
                </Text>
              </View>
            ) : (
              <TouchableOpacity onPress={onSave} style={[styles.saveBtn, { backgroundColor: cardBg }]}>
                <Text style={[styles.saveBtnText, { color: theme.colors.text }]}>Lưu thay đổi</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  label,
  value,
  editable,
  onChangeText,
  keyboardType,
  themeText,
  mutedText,
  inputBg,
  isDarkMode,
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={[styles.label, { color: mutedText }]}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder="—"
        placeholderTextColor={isDarkMode ? "rgba(0,0,0,0.45)" : "#666"}
        style={[
          styles.input,
          { backgroundColor: inputBg, color: themeText },
          !editable && styles.inputDisabled,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // header giống Home
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
  logo: { fontSize: 28, fontWeight: "bold", letterSpacing: 1 },
  iconButton: { padding: 8 },
  headerActionText: { fontSize: 16, fontWeight: "800" },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 30, gap: 16 },

  headerCard: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: "#222",
  },
  nameText: { fontSize: 18, fontWeight: "700" },
  subText: { marginTop: 2 },

  card: { padding: 14, borderRadius: 16 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 16, fontWeight: "700" },

  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editBtnText: { fontWeight: "700" },

  label: {
    color: "rgba(255,255,255,0.9)", 
    marginBottom: 6 
},
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  inputDisabled: { opacity: 0.75 },

  saveBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtnText: { fontWeight: "800" },

  infoBox: {
    marginTop: 16,
    gap: 6,
    padding: 12,
    borderRadius: 14,
  },
  infoText: {},
});
