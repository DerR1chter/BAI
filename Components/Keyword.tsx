import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { KeywordProps } from '../types';
import useFlicker from './useFlicker';

const styles = StyleSheet.create({
  keyword: {
    backgroundColor: '#F1F2FF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    height: 60,
    width: 170,
    justifyContent: 'center',
  },
  keywordText: {
    color: '#3B29B5',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});

export const Keyword: React.FC<KeywordProps> = ({ text, frequency }) => {
    const { flickerAnim, isFlickering, startFlickering, stopFlickering } = useFlicker(frequency);

    const handlePress = () => {
        if (isFlickering) {
            stopFlickering();
        } else {
            startFlickering();
        }
    };

    return (
        <Animated.View style={{ ...styles.keyword, opacity: flickerAnim }}>
            <TouchableOpacity onPress={handlePress}>
                <Text style={styles.keywordText}>{text}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};