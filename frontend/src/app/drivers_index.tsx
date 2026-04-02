import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";



export default function DriverPage() {

  const [trips, setTrips] = useState([]);
  const loadTrips = async () => {
    const res = await fetch("http://127.0.0.1:8000/trip/available");
    const data = await res.json();
    setTrips(data);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const takeTrip = async (id:number) => {

    await fetch("http://127.0.0.1:8000/trip/take", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            trip_id: id,
        })
    });

    loadTrips();
    };


  const finishTrip = async (id:number) => {

    await fetch(`http://127.0.0.1:8000/trip/finish/${id}`, {
      method: "POST",
    });

    loadTrips();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Поездки для водителей</Text>

      <ScrollView>

        {trips.map((trip:any) => (

          <View key={trip.id} style={styles.card}>

            <Text style={styles.route}>
              {trip.from_address} → {trip.to_address}
            </Text>

            <Text style={styles.price}>
              {trip.price} ₽
            </Text>

            {!trip.driver_id && (
              <TouchableOpacity
                style={styles.takeButton}
                onPress={() => takeTrip(trip.id)}
              >
                <Text style={styles.buttonText}>Принять поездку</Text>
              </TouchableOpacity>
            )}

            {trip.driver_id && !trip.is_done && (
              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => finishTrip(trip.id)}
              >
                <Text style={styles.buttonText}>Завершить поездку</Text>
              </TouchableOpacity>
            )}

            {trip.is_done && (
              <Text style={styles.done}>Поездка завершена</Text>
            )}

          </View>

        ))}

      </ScrollView>

    </View>
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
}

});
