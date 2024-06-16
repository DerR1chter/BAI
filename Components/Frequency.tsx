import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import useFlicker from '../Helpers/useFlicker';
import {FrequencyProps} from '../types';

/**
 * Frequency component - Renders a frequency button with flicker animation.
 * @param {FrequencyProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const Frequency: React.FC<FrequencyProps> = ({
  frequency,
  style,
}: FrequencyProps): JSX.Element => {
  const {flickerAnim, isFlickering, startFlickering, stopFlickering} =
    useFlicker(frequency);

  /**
   * Handles the press event to start or stop the flicker animation.
   */
  const handlePress = () => {
    if (isFlickering) {
      stopFlickering();
    } else {
      startFlickering();
    }
  };

  // Creates an animated style based on the flicker animation value.
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

// Styles for the Frequency component
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
    color: '#1246AC',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});
