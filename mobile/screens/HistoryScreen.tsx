import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';

type Submission = {
  id: number;
  timestamp: string;
  note: string;
};

export default function HistoryScreen() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Simulate fetch
      await new Promise(res => setTimeout(res, 1000));
      const mock = [
        { id: 1, timestamp: '2025-07-17 10:00', note: 'Test A' },
        { id: 2, timestamp: '2025-07-16 09:30', note: 'Test B' },
      ];
      setSubmissions(mock);
    } catch (e) {
      Alert.alert('Failed to fetch history');
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <FlatList
      data={submissions}
      keyExtractor={item => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <Text>{item.note}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  timestamp: {
    fontWeight: 'bold',
  },
});
