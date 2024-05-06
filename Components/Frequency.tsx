import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
import {FrequencyProps} from '../types';
import useFlicker from '../Helpers/useFlicker';

const styles = StyleSheet.create({
  keyword: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    height: 220,
    width: 180,
    justifyContent: 'center',
  },
  keywordText: {
    color: '#3B29B5',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});

export const Frequency: React.FC<FrequencyProps> = ({frequency, style}) => {
  const {flickerAnim, isFlickering, startFlickering, stopFlickering} =
    useFlicker(frequency);

  const handlePress = () => {
    if (isFlickering) {
      stopFlickering();
    } else {
      startFlickering();
    }
  };

  return (
    <Animated.View style={{...styles.keyword, opacity: flickerAnim, ...style}}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.keywordText}>{`${frequency} Hz`}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
