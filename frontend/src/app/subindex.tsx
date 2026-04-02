import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Platform
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView>
        <SafeAreaView>
            <Button
            title="🏆 View Leaderboard"
            />
            <Button
            title="mainscreen"
            onPress={() => router.push('/')} // <-- здесь путь к экрану
            />
        </SafeAreaView>
    </ThemedView>
  );
}
