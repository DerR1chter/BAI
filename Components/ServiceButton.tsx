import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ServiceButtonProps } from '../types';

const styles = StyleSheet.create({
    serviceButton: {
      backgroundColor: '#6E55FF',
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      margin: 5,
    },
    serviceButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
  });

export const ServiceButton: React.FC<ServiceButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.serviceButton} onPress={onPress}>
      <Text style={styles.serviceButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};
