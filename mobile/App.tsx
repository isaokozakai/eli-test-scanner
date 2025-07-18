import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HistoryScreen from './components/HistoryScreen';
import CameraModal from './components/CameraModal';

export default function App() {
  const [openCamera, setOpenCamera] = useState(false);

  return (
    <GestureHandlerRootView style={styles.container}>
      <HistoryScreen openCamera={() => setOpenCamera(true)} />
      {openCamera && <CameraModal onClose={() => setOpenCamera(false)} />}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
