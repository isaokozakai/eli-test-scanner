import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  Button,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

type CameraProps = {
  onClose: () => void;
};

export default function CameraModal({ onClose }: CameraProps) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const handleQRCodeScanned = (codes: any[]) => {
    const value = codes[0]?.value;
    if (value) {
      setQrCode(value);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
        });
        setPhotoUri('file://' + photo.path);
        setPreviewVisible(true);
      } catch (error) {
        Alert.alert('Photo error', 'Failed to take photo.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!qrCode || !photoUri) {
      Alert.alert('Missing data', 'Please scan a QR code and take a photo.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append('image', {
        uri: photoUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(
        // TIP: use your local IP address (e.g. http://192.168.x.x:3000) instead of 'localhost' when testing on a physical device
        'http://localhost:3000/api/test-strips/upload',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      Alert.alert('Success', 'Submission successful.');
      reset();
    } catch (e) {
      console.log({ e });
      Alert.alert('Error', 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setQrCode(null);
    setPhotoUri(null);
    setPreviewVisible(false);
  };

  return (
    device &&
    hasPermission && (
      <>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          photo
          codeScanner={{
            codeTypes: ['qr'],
            onCodeScanned: handleQRCodeScanned,
          }}
        />
        <View style={styles.overlayTop}>
          <Button
            title="Close"
            onPress={() => {
              reset();
              onClose();
            }}
          />
        </View>
        <View style={styles.overlayBottom}>
          <TouchableOpacity onPress={takePhoto} style={styles.button}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={previewVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            {photoUri && (
              <Image source={{ uri: photoUri }} style={styles.previewImage} />
            )}
            <Text style={styles.qrText}>QR Code: {qrCode || 'Not found'}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={reset} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    )
  );
}

const styles = StyleSheet.create({
  overlayTop: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00000099',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
  },
  qrText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#0a84ff',
    padding: 12,
    borderRadius: 8,
  },
});
