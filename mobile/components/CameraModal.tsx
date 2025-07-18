import React, { useRef, useState } from 'react';
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
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  const handleQRCodeScanned = (codes: any[]) => {
    const value = codes[0]?.value;
    if (value && !qrCode) {
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

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // formData.append('qrCode', qrCode);

      formData.append('image', {
        uri: photoUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(
        'http://192.168.0.18:3000/api/test-strips/upload',
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

      Alert.alert('Success', 'Submission successful.', undefined, {
        onDismiss: onClose,
      });
      reset();
    } catch (e) {
      console.log({ e });
      Alert.alert('Error', 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setQrCode(null);
    setPhotoUri(null);
    setPreviewVisible(false);
  };

  if (!hasPermission)
    return (
      <View style={styles.centered}>
        <Text>We need access to your camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );

  return (
    device && (
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
          <Button title="Close" onPress={onClose} />
        </View>
        <View style={styles.overlayBottom}>
          <TouchableOpacity onPress={takePhoto} style={styles.button}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={isPreviewVisible} transparent animationType="slide">
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
  container: { flex: 1 },
  topOverlay: {
    position: 'absolute',
    top: 30,
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
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
