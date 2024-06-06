import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {ServiceButton} from '../Components/ServiceButton';

interface ConfirmationModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onRequestClose,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.confirmModalView}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmTitle}>{title}</Text>
          <Text style={styles.confirmMessage}>{message}</Text>
          <View style={styles.confirmButtons}>
            <ServiceButton
              text="Yes"
              onPress={onConfirm}
              style={{marginRight: 10}}
            />
            <ServiceButton text="No" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  confirmModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  confirmContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
  },
});

export default ConfirmationModal;
