import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ResponseBubbleProps } from '../types';

const styles = StyleSheet.create({
  responseBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4945BD',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: 200,
    marginTop: 20,
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
  },
  responseText: {
    flex: 1,
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  responseIcon: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
});

export const ResponseBubble: React.FC<ResponseBubbleProps> = ({ text }) => {
    return (
      <View style={styles.responseBubble}>
        <Text style={styles.responseText}>{text}</Text>
        <Image source={require('../assets/speaker.png')} style={styles.responseIcon} resizeMode="contain" />
      </View>
    );
  };