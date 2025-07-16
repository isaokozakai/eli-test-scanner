import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      const permission = (await Camera.requestCameraPermission()) as
        | 'authorized'
        | 'denied'
        | 'not-determined'
        | 'restricted';
      setHasPermission(permission === 'authorized');
    })();
  }, []);

  if (device == null) return <Text style={styles.message}>Loading...</Text>;
  if (!hasPermission)
    return <Text style={styles.message}>No camera permission</Text>;

  return (
    <Camera
      style={styles.camera}
      device={device}
      isActive={true}
      photo={true}
    />
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  message: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center', // Android vertical center
    fontSize: 18,
    color: '#333',
  },
});
