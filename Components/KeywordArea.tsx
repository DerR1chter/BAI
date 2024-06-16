// KeywordArea.tsx
import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {Keyword} from './Keyword';
import {ServiceButton} from './ServiceButton';
import {KeywordAreaProps} from '../types';

/**
 * KeywordArea component - Displays a grid of keywords and service buttons.
 * @param {KeywordAreaProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const KeywordArea: React.FC<KeywordAreaProps> = ({
  keywords,
  onKeywordPress,
  services,
  onServicePress,
  waitingForResponse,
}: KeywordAreaProps): JSX.Element => {
  const keyWordsLoaded = keywords.length > 0;

  return (
    <View style={styles.container}>
      {waitingForResponse ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color="#1246AC" />
        </View>
      ) : (
        <View style={styles.keywordArea}>
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

// Styles for the KeywordArea component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
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
    minHeight: 65,
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
    minHeight: 50,
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
