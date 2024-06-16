import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
import {KeywordProps} from '../types';

/**
 * Keyword component - Renders a keyword button.
 * @param {KeywordProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const Keyword: React.FC<KeywordProps> = ({
  text,
  onKeywordPress,
}: KeywordProps): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={() => onKeywordPress(text)}
      style={styles.keywordContainer}>
      <Animated.View style={styles.keyword}>
        <Text style={styles.keywordText}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Styles for the Keyword component
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
    backgroundColor: '#EFF3FE',
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
    color: '#1246AC',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});
