import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const [menuVisible, setMenuVisible] = useState(false); // управление модальным меню
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  

  // Проверка токена при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const name = await AsyncStorage.getItem("user_name");
      const user_id = await AsyncStorage.getItem("user_id");
      const is_driver = await AsyncStorage.getItem("is_driver");
      console.log(is_driver);
      if (!is_driver) {
        setRole("пассажиром");
      } else {
        setRole("водителем");
      }
      if (!token) {
        router.replace("/login");
      } else {
        setUserName(name || "");
        setUserId(user_id || "");
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const createRide = async () => {
    const user_id = await AsyncStorage.getItem("user_id");
    const response = await fetch("http://127.0.0.1:8000/trip/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_address: from,
        to_address: to,
        price: Number(price),
        passenger_id: user_id,
      }),
    });
  };

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  const toggleRole = () => {
    router.replace("/drivers_index");
  };
  const to_profile = () => {
    if (role != "пассажиром") {
      router.replace("/passenger_profile")
    } else{
      router.replace("/driver_profile")
    }
  };

  if (loading) return <Text style={{color: "white", marginTop: 50, textAlign: "center"}}>Checking auth...</Text>;

  
  return (
    <View style={styles.container}>
        
      {/* Кнопка меню */}
      <View style={[styles.topLeftButtons, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.circleButton} onPress={() => setMenuVisible(true)}>
          <Text style={styles.icon}>≡</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/shop_for_points')}>
          <Text style={styles.icon}>🎁</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное меню */}
      <Modal
        animationType="slide"
        transparent
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuText}>Имя: {userName}</Text>
            <Text style={styles.menuText}>ID: {userId}</Text>

            <TouchableOpacity style={styles.menuButton} onPress={() => to_profile()}>
              <Text style={styles.menuButtonText}>Личный кабинет</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={toggleRole}>
              <Text style={styles.menuButtonText}>Стать {role}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={logout}>
              <Text style={styles.menuButtonText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Нижняя панель */}
      <SafeAreaView style={styles.bottomPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Category title="Поездка" active />
          <Category title="Курьер" />
          <Category title="Пригород" />
          <Category title="Межгород" />
          <Category title="Грузовые" />
        </ScrollView>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Откуда</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите адрес"
            placeholderTextColor="gray"
            value={from}
            onChangeText={setFrom}
          />
        </View>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Куда</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите адрес"
            placeholderTextColor="gray"
            value={to}
            onChangeText={setTo}
          />
        </View>

        <View style={styles.inputBlock}>
          <TextInput
            style={styles.input}
            placeholder="₽ Предложите цену"
            placeholderTextColor="gray"
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={createRide}>
          <Text style={styles.orderText}>Заказать</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function Category({ title, active = false }: { title: string; active?: boolean }) {
  return (
    <TouchableOpacity style={[styles.category, active && styles.categoryActive]}>
      <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#2e3237",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  category: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#3b3f45", borderRadius: 12, marginRight: 10 },
  categoryActive: { backgroundColor: "#4a4f56" },
  categoryText: { color: "#ccc", fontSize: 14 },
  categoryTextActive: { color: "#fff" },
  inputBlock: { marginTop: 14 },
  label: { color: "#aaa", marginBottom: 4 },
  input: { backgroundColor: "#3b3f45", borderRadius: 10, padding: 12, color: "white" },
  orderButton: { marginTop: 14, backgroundColor: "#8de000", padding: 16, borderRadius: 12, alignItems: "center" },
  orderText: { fontSize: 18, fontWeight: "600" },
  topLeftButtons: { position: "absolute", left: 16, flexDirection: "column", gap: 10 },
  circleButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#3b3f45", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 5, elevation: 5 },
  icon: { color: "white", fontSize: 22, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  menuContainer: {
    backgroundColor: "#2e3237",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
  },
  map: {

        width: "100%",
        height: "40%",

    },
  menuText: { color: "#fff", fontSize: 18, marginBottom: 12 },
  menuButton: { backgroundColor: "#8de000", padding: 12, borderRadius: 10, marginTop: 10, alignItems: "center" },
  menuButtonText: { fontSize: 16, fontWeight: "600" },
});
