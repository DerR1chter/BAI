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
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color="#1246AC" />
        </View>
      ) : (
        <View style={styles.keywordArea}>
          {/* {keyWordsLoaded && (
            <Text style={styles.text}>{t('Select_keyword')}</Text>
          )} */}
          <View style={styles.grid}>
            {keywords.map((keyword, index) => (
              <View key={index} style={styles.card}>
                <Keyword text={keyword} onKeywordPress={onKeywordPress} />
              </View>
            ))}
          </View>
          <View style={styles.serviceGrid}>
            {keyWordsLoaded &&
              services.map((service, index) => (
                <View key={index} style={styles.serviceCard}>
                  <ServiceButton
                    key={index}
                    text={service}
                    onPress={() => onServicePress(service)}
                  />
                </View>
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
    width: '40%', // Fixed width in pixels
    height: '34%', // Fixed height in pixels
    marginLeft: 5, // Spacing between cards
    marginRight: 5, // Spacing between cards
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    width: '40%', // Fixed width in pixels
    height: '40%', // Fixed height in pixels
    marginLeft: 5, // Spacing between cards
    marginRight: 5, // Spacing between cards
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
