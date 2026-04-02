// src/app/leaderboard.tsx
import { useEffect, useState } from "react";
import {
View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Platform
} from "react-native";

type User = {
  user_id: number;
  xp: number;
};

const BASE_URL = "http://10.232.87.218:8000";

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/top`)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Top Users</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.user_id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.user}>User {item.user_id}</Text>
            <Text style={styles.xp}>{item.xp} XP</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  rank: { width: 30 },
  user: { flex: 1 },
  xp: { fontWeight: "bold" },
});
