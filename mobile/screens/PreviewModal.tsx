import React from 'react';
import { Modal, View, Image, Button, StyleSheet } from 'react-native';

type Props = {
  photoPath: string;
  onClose: () => void;
  onSubmit: () => void;
};

export default function PreviewModal({ photoPath, onClose, onSubmit }: Props) {
  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modal}>
        <Image source={{ uri: `file://${photoPath}` }} style={styles.image} />
        <View style={styles.actions}>
          <Button title="Submit" onPress={onSubmit} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
});
