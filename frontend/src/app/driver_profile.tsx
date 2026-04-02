// DriverCabinet.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";

export default function DriverCabinet({ driverId }: { driverId: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/drivers/${driverId}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Личный кабинет водителя</Text>
      <View style={styles.row}>
        <Text style={styles.label}>ID:</Text>
        <Text>{data.id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Имя:</Text>
        <Text>{data.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Активен:</Text>
        <Text>{data.is_active ? "Да" : "Нет"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Рейтинг:</Text>
        <Text>{data.rating}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 15 },
  label: { fontWeight: "bold", width: 120 }
});
