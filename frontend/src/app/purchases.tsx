import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Purchases() {

  const [goods, setGoods] = useState<any[]>([]);
  const [userId, setUserId] = useState<any>("");

  const router = useRouter();

  useEffect(() => {

    const load = async () => {

      const user_id = await AsyncStorage.getItem("user_id");

      if (!user_id) return;

      setUserId(user_id);

      const res = await fetch(`http://localhost:8000/shop/purchases?user_id=${user_id}`);

      const data = await res.json();

      setGoods(data);

    };

    load();

  }, []);

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>Мои покупки</Text>

      {goods.length === 0 && (
        <Text style={styles.empty}>У вас пока нет покупок</Text>
      )}

      {goods.map(item => (

        <View key={item.purchase_id} style={styles.card}>

          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.discription}>{item.description}</Text>

          <Text style={styles.price}>{item.price} баллов</Text>

        </View>

      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/shop_for_points")}
      >
        <Text>В магазин</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/")}
      >
        <Text>На главную</Text>
      </TouchableOpacity>

    </ScrollView>

  );
}
const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:"#000",
  padding:20
},

title:{
  color:"white",
  fontSize:26,
  marginBottom:20
},

card:{
  backgroundColor:"#2e3237",
  padding:15,
  borderRadius:10,
  marginBottom:15
},

name:{
  color:"white",
  fontSize:18
},

discription:{
  color:"#aaa",
  marginTop:5
},
price:{
  color:"#8de000",
  marginTop:5
},

buy:{
  marginTop:10,
  backgroundColor:"#8de000",
  padding:10,
  borderRadius:8,
  alignItems:"center"
},
button: {
    backgroundColor: "#8de000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
},
empty:{
  color:"#aaa",
  marginBottom:20
},
})