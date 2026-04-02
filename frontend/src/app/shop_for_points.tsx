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

export default function Shop() {

  const [goods, setGoods] = useState<any[]>([]);
  const [balance, setBalance] = useState<any>("");
  const [userId, setUserId] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    const getAsyncItems = async () => {
        const user_id = await AsyncStorage.getItem("user_id");
        const balance_res = await fetch(`http://localhost:8000/shop/get_balance?user_id=${user_id}`);
        const user_bal = await balance_res.json();
        setUserId(user_id);
        setBalance(user_bal);
    };
    getAsyncItems();
    console.log(userId, balance);
    fetch("http://localhost:8000/shop")
      .then(res => res.json())
      .then(data => setGoods(data));
  }, []);

  const buy = (id:number) => {

    fetch(`http://localhost:8000/shop/buy?user_id=${userId}&goods_id=${id}`, {
      method: "POST"
    })
  }

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>Магазин</Text>
      <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/purchases")}
      >
        <Text>Покупки</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Баллы: {balance}</Text>

      {goods.map(item => (

        <View key={item.id} style={styles.card}>

          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.discription}>{item.discription}</Text>

          <Text style={styles.price}>{item.price} баллов</Text>

          <TouchableOpacity
            style={styles.buy}
            onPress={() => buy(item.id)}
          >
            <Text>Купить</Text>
          </TouchableOpacity>

        </View>

      ))}
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
})
