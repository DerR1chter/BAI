import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { InputBubbleProps } from '../types';

const styles = StyleSheet.create({
  inputBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4945BD',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: 130,
    marginTop: 20,
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
  },
  inputText: {
    flex: 1,
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  inputIcon: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
});

export const InputBubble: React.FC<InputBubbleProps> = ({ text }) => {
    return (
      <View style={styles.inputBubble}>
        <Text style={styles.inputText}>{text}</Text>
        <Image source={require('../assets/mic.png')} style={styles.inputIcon} resizeMode="contain" />
      </View>
    );
  };