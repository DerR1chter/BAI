// KeywordArea.tsx
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Keyword} from './Keyword';
import {ServiceButton} from './ServiceButton';
import {KeywordAreaProps} from '../types';

const styles = StyleSheet.create({
  keywordArea: {
    margin: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    // flexBasis: '48%', // Slightly less than half the container width to fit two items per row
    marginBottom: 10, // Spacing between the rows
  },
  text: {
    color: '#000000',
    fontSize: 20,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
  serviceRow: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const KeywordArea: React.FC<KeywordAreaProps> = ({
  keywords,
  onKeywordPress,
  frequencies,
  services,
  onServicePress,
}) => {
  return (
    <View style={styles.keywordArea}>
      <Text style={styles.text}>Select a keyword for your answer</Text>
      <View style={styles.grid}>
        {keywords.map((keyword, index) => (
          <View key={index} style={styles.card}>
            <Keyword
              text={`${keyword}: ${frequencies[index]}Hz`}
              frequency={frequencies[index]}
            />
          </View>
        ))}
      </View>
      <View style={styles.serviceRow}>
        {services.map((service, index) => (
          <ServiceButton
            key={index}
            text={service}
            onPress={() => onServicePress(service)}
          />
        ))}
      </View>
    </View>
  );
};
