import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {SettingsButtonProps} from '../types';

const styles = StyleSheet.create({
  serviceButton: {
    backgroundColor: '#668EDA',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    height: 50,
    width: 'auto',
    minWidth: '40%',
    justifyContent: 'center',
  },
  serviceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  noneButton: {
    backgroundColor: '#F9F0F0',
  },
  noneText: {
    color: '#F07476',
  },
});

/**
 * SettingsButton component - A customizable button used in settings.
 * @param {SettingsButtonProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const SettingsButton: React.FC<SettingsButtonProps> = ({
  text,
  onPress,
  style = {},
}: SettingsButtonProps): JSX.Element => {
  return (
    <TouchableOpacity style={[styles.serviceButton, style]} onPress={onPress}>
      <Text style={styles.serviceButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};
