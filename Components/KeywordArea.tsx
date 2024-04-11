import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Keyword } from './Keyword';
import { ServiceButton } from './ServiceButton';
import { KeywordAreaProps } from '../types';

const styles = StyleSheet.create({
  keywordArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 10,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    display: 'flex',
  },
});

export const KeywordArea: React.FC<KeywordAreaProps> = ({ keywords, onKeywordPress, services, onServicePress }) => {
    return (
      <View style={styles.keywordArea}>
        <Text style={styles.text}>Select a keyword for your answer</Text>
        {keywords.map((keyword, index) => (
          <Keyword key={index} text={keyword} onPress={() => onKeywordPress(keyword)} />
        ))}
        {services.map((service, index) => (
          <ServiceButton key={index} text={service} onPress={() => onServicePress(service)} />
        ))}
      </View>
    );
  };