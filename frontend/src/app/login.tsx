import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [firstLogin, setFirstLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            router.replace("/");
        }
    };
    checkUser();
}, []);

  const handleLogin = async () => {
    if (!phone) return Alert.alert("Ошибка", "Введите номер телефона");

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firstLogin ? { phone, name } : { phone }),
      });

      if (response.status === 400) {
        // имя требуется
        setFirstLogin(true);
      } else if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("token", data.access_token);
        await AsyncStorage.setItem("user_name", data.user_name);
        await AsyncStorage.setItem("user_id", data.user_id);
        await AsyncStorage.setItem("is_driver", data.is_driver);
        router.replace("/"); // переходим на главную
      } else {
        const err = await response.json();
        Alert.alert("Ошибка", err.detail || "Не удалось авторизоваться");
      }
    } catch (e) {
      Alert.alert("Ошибка", "Сервер недоступен");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <Text style={styles.label}>Номер телефона</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите номер телефона"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {firstLogin && (
        <>
          <Text style={styles.label}>Имя</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите имя"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Загрузка..." : firstLogin ? "Зарегистрироваться" : "Войти"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  label: {
    color: "#aaa",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#3b3f45",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#8de000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
