import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PassengerProfile() {

  const router = useRouter();

  const [xp, setXp] = useState(0);
  const [trips, setTrips] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");


  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

      const name = await AsyncStorage.getItem("user_name");
      const user_id = await AsyncStorage.getItem("user_id");
      const xpRes = await fetch(`http://127.0.0.1:8000/xp/${userId}`);
      const xpData = await xpRes.json();

      setXp(xpData.xp);
      setUserId(user_id || "");
      setUserName(name || "");

      const tripsRes = await fetch(`http://127.0.0.1:8000/trips`);
      const tripsData = await tripsRes.json();

      setTrips(tripsData);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Профиль водителя</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Имя</Text>
        <Text style={styles.value}>{userName} ({userId})</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>XP</Text>
        <Text style={styles.value}>0</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Поездок</Text>
        <Text style={styles.value}>0</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
      >
        <Text style={styles.buttonText}>История поездок</Text>
      </TouchableOpacity>

      

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>На главную</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 20
  },

  subtitle: {
    fontSize: 18,
    color: "white",
    marginTop: 20,
    marginBottom: 10
  },

  card: {
    backgroundColor: "#2e3237",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10
  },

  label: {
    color: "#aaa"
  },

  value: {
    color: "white",
    fontSize: 20,
    fontWeight: "600"
  },

  tripList: {
    flex: 1
  },

  tripCard: {
    backgroundColor: "#3b3f45",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },

  tripRoute: {
    color: "white",
    fontSize: 16
  },

  tripPrice: {
    color: "#8de000",
    marginTop: 4
  },

  button: {
    backgroundColor: "#8de000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },

  buttonText: {
    fontWeight: "600",
    fontSize: 16
  }

});
