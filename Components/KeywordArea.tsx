// KeywordArea.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {Keyword} from './Keyword';
import {ServiceButton} from './ServiceButton';
import {KeywordAreaProps} from '../types';
import {useTranslation} from 'react-i18next';

export const KeywordArea: React.FC<KeywordAreaProps> = ({
  keywords,
  onKeywordPress,
  services,
  onServicePress,
  waitingForResponse,
}) => {
  const keyWordsLoaded = keywords.length > 0;
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {waitingForResponse ? (
        <ActivityIndicator size="large" color="#3A2BB5" />
      ) : (
        <View style={styles.keywordArea}>
          {keyWordsLoaded && (
            <Text style={styles.text}>{t('Select_keyword')}</Text>
          )}
          <View style={styles.grid}>
            {keywords.map((keyword, index) => (
              <View key={index} style={styles.card}>
                <Keyword text={keyword} onKeywordPress={onKeywordPress} />
              </View>
            ))}
          </View>
          <View style={styles.serviceRow}>
            {keyWordsLoaded &&
              services.map((service, index) => (
                <ServiceButton
                  key={index}
                  text={service}
                  onPress={() => onServicePress(service)}
                />
              ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceRow: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
