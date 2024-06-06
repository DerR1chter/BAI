import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import useFlicker from '../Helpers/useFlicker';
import {FrequencyProps} from '../types';

const styles = StyleSheet.create({
  keyword: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    height: 200,
    width: 160,
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: flickerAnim.value,
    };
  });

  return (
    <Animated.View style={[styles.keyword, animatedStyle, style]}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.keywordText}>{`${frequency} Hz`}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
