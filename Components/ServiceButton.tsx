import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {ServiceButtonProps} from '../types';
import Animated from 'react-native-reanimated';

const styles = StyleSheet.create({
  keywordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: '100%',
    height: '100%',
  },
  keyword: {
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keywordText: {
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

export const ServiceButton: React.FC<ServiceButtonProps> = ({
  text,
  onPress,
  style,
}) => {
  const backgroundColor = {
    Correction: '#668EDA',
    More: '#668EDA',
    None: '#FCF0F0',
    Finished: '#1246AC',
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.keywordContainer}>
      <Animated.View
        style={[styles.keyword, {backgroundColor: backgroundColor[text]}]}>
        <Text style={[styles.keywordText, text === 'None' && styles.noneText]}>
          {text}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
