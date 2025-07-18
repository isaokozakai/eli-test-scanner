import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';

type HistoryProps = {
  openCamera: () => void;
};

type Submission = {
  id: number;
  thumbnail_path: string;
  created_at: string;
  status: string;
};

export default function HistoryScreen({ openCamera }: HistoryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('http://192.168.0.18:3000/api/test-strips', {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load submissions');
      }

      const data = await response.json();
      setSubmissions(data as Submission[]);
    } catch (e) {
      Alert.alert('Error', 'Load failed.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <Button title="Open Camera" onPress={openCamera} />
      <FlatList
        data={submissions}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.status}</Text>
            <Text style={styles.text}>{item.created_at}</Text>
          </View>
        )}
      />
    </View>
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
  text: {
    fontWeight: 'bold',
  },
});
