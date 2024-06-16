import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {SettingsButton} from '../Components/SettingsButton';
import {ConfirmationModalProps} from '../types';

/**
 * ConfirmationModal component - A modal dialog to confirm an action.
 * @param {ConfirmationModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onRequestClose,
  onConfirm,
  onCancel,
  title,
  message,
}: ConfirmationModalProps): JSX.Element => {
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
            <SettingsButton
              text="Yes"
              onPress={onConfirm}
              style={{marginRight: 10}}
            />
            <SettingsButton text="No" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles for the ConfirmationModal component
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
