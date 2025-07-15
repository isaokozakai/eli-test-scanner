import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back" // only back camera
      />
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            console.log("Photo URI:", photo.uri);
          }
        }}
      >
        <Text style={styles.buttonText}>📸 Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
