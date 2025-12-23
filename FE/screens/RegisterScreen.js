import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { API } from "../api/api";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Mật khẩu không khớp");
      return;
    }

    try {
      const res = await API.post("/auth/register", { email, password });
      setMessage("Đăng ký thành công!");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);
    } catch (err) {
      console.log(err.response?.data);
      setMessage(err.response?.data?.error || "Lỗi đăng ký");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/antman.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.logo}>M-FLIX</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.orBtn}>
          or press below button if already have account
        </Text>

        <TouchableOpacity
          style={styles.fbBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.fbText}>Sign In</Text>
        </TouchableOpacity>

        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 30,
    borderRadius: 10,
    margin: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "red",
    marginBottom: 30,
    alignSelf: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 20,
    color: "white",
    fontSize: 16,
    paddingVertical: 8,
  },
  registerBtn: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  orBtn: {
    fontStyle: "italic",
    color: "#fff",
    opacity: 0.3,
    textAlign: "center",
    marginBottom: 5,
  },
  fbBtn: {
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  fbText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    marginTop: 15,
    color: "red",
    textAlign: "center",
  },
});
