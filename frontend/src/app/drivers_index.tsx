import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DriverPage() {

  const [trips, setTrips] = useState<any[]>([]);
  const [driverId, setDriverId] = useState<any>("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {

    const load = async () => {

      const user_id = await AsyncStorage.getItem("user_id");

      if (!user_id) return;

      setDriverId(user_id);

      const res = await fetch("http://127.0.0.1:8000/trip/available");
      const data = await res.json();

      setTrips(data);
    
    };

    load();

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const name = await AsyncStorage.getItem("user_name");
      const user_id = await AsyncStorage.getItem("user_id");
      const is_driver = await AsyncStorage.getItem("is_driver");
      if (!token) {
        router.replace("/login");
      } else {
        setUserName(name || "");
        setUserId(user_id || "");
      }
    };
    checkAuth();
    
  }, []);

  const loadTrips = async () => {

    const res = await fetch("http://127.0.0.1:8000/trip/available");
    const data = await res.json();

    setTrips(data);

  };

  const takeTrip = async (id:number) => {

    await fetch("http://127.0.0.1:8000/trip/take", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        trip_id: id,
        driver_id: driverId
      })
    });

    loadTrips();

  };

  const finishTrip = async (id:number) => {

    await fetch(`http://127.0.0.1:8000/trip/finish/${id}`, {
      method: "POST"
    });

    loadTrips();

  };
  const logout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

  return (

    <View style={styles.container}>
      <View style={[styles.topLeftButtons, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.circleButton} onPress={() => setMenuVisible(true)}>
          <Text style={styles.icon}>≡</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circleButton} onPress={() => router.push('/shop_for_points')}>
          <Text style={styles.icon}>🎁</Text>
        </TouchableOpacity>
      </View>
    <View style={styles.otstup}/>

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
    
                <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/driver_profile')}>
                  <Text style={styles.menuButtonText}>Личный кабинет</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/')}>
                  <Text style={styles.menuButtonText}>Рейтинг</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/')}>
                  <Text style={styles.menuButtonText}>Стать пассажиром</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.menuButton} onPress={logout}>
                  <Text style={styles.menuButtonText}>Выйти</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>


      <Text style={styles.title}>Поездки для водителей</Text>

      <ScrollView>

        {trips.map((trip:any) => (

          <View key={trip.trip_id} style={styles.card}>

            <Text style={styles.route}>
              {trip.from_address} → {trip.to_address}
            </Text>

            <Text style={styles.price}>
              {trip.price} ₽
            </Text>

            {!trip.driver_id && (
              <TouchableOpacity
                style={styles.takeButton}
                onPress={() => takeTrip(trip.trip_id)}
              >
                <Text style={styles.buttonText}>Завершить поездку</Text>
              </TouchableOpacity>
            )}

           {/*{trip.driver_id && !trip.is_done && (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => finishTrip(trip.trip_id)}
              >
                <Text style={styles.buttonText}>Завершить поездку</Text>
              </TouchableOpacity>
            )}

            {trip.is_done && (
              <Text style={styles.done}>Поездка завершена</Text>
            )}*/}

          </View>

        ))}

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

otstup: {
  marginTop: "30%",
},

container:{
  flex:1,
  backgroundColor:"#000",
  padding:20
},

title:{
  color:"white",
  fontSize:26,
  fontWeight:"700",
  marginBottom:20
},

card:{
  backgroundColor:"#3b3f45",
  padding:16,
  borderRadius:10,
  marginBottom:12
},

route:{
  color:"white",
  fontSize:16
},

price:{
  color:"#8de000",
  marginTop:4,
  fontSize:16
},

takeButton:{
  marginTop:10,
  backgroundColor:"#8de000",
  padding:10,
  borderRadius:8,
  alignItems:"center"
},

finishButton:{
  marginTop:10,
  backgroundColor:"#ffb300",
  padding:10,
  borderRadius:8,
  alignItems:"center"
},

buttonText:{
  fontWeight:"600"
},

done:{
  marginTop:10,
  color:"#8de000"
},

button:{
  backgroundColor:"#8de000",
  padding:16,
  borderRadius:12,
  alignItems:"center",
  marginTop:10
},
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
