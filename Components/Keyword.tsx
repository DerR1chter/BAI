import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';
import {KeywordProps} from '../types';

const styles = StyleSheet.create({
  keyword: {
    backgroundColor: '#F1F2FF',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    height: 55,
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

export const Keyword: React.FC<KeywordProps> = ({text, onKeywordPress}) => {
  return (
    <TouchableOpacity onPress={() => onKeywordPress(text)} style={{margin: 5}}>
      <Animated.View style={styles.keyword}>
        <Text style={styles.keywordText}>{text}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
