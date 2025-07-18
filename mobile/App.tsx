import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import CameraScreen from './screens/CameraScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      const permission = (await Camera.requestCameraPermission()) as string;
      setHasPermission(permission === 'authorized');
    })();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Camera">
          <Stack.Screen
            name="Camera"
            component={() =>
              device && hasPermission ? (
                <CameraScreen device={device} />
              ) : (
                <View style={styles.centered}>
                  <Text>Loading camera...</Text>
                </View>
              )
            }
          />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
