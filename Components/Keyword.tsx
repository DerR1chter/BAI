import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { KeywordProps } from '../types';

const styles = StyleSheet.create({
  keyword: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
  },
  keywordText: {
    color: '#3B29B5',
    fontSize: 16,
  },
});

export const Keyword: React.FC<KeywordProps> = ({ text, onPress }) => {
    return (
      <TouchableOpacity style={styles.keyword} onPress={onPress}>
        <Text style={styles.keywordText}>{text}</Text>
      </TouchableOpacity>
    );
  };