import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <CenterButton title="Топ водителей" onPress={() => router.push('/leaderboard')} />
      <CenterButton title="Кнопка 2" onPress={() => console.log("Button 2")} />
      <CenterButton title="Кнопка 3" onPress={() => console.log("Button 3")} />
    </View>
  );
}

function CenterButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // центр по вертикали
    alignItems: "center", // центр по горизонтали
    backgroundColor: "#fff",
  },

  button: {
    width: 220,
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
