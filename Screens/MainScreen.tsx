import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {InputBubble} from '../Components/InputBubble';
import {KeywordArea} from '../Components/KeywordArea';
import {ResponseBubble} from '../Components/ResponseBubble';

const MainScreen: React.FC = () => {
  const handleKeywordPress = (keyword: string) => {
    console.log(`Keyword pressed: ${keyword}`);
  };

  const handleServicePress = (service: string) => {
    console.log(`Service pressed: ${service}`);
  };

  const frequencies = [4, 6, 8, 12, 20, 24];
  const keywords = [
    'Pickup',
    'Delivery',
    'Menu',
    'Hours',
    'Reservations',
    'Specials',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueSection}>
        <Text style={styles.eegchat}>EEGChat</Text>
        <InputBubble text="Pizzeria Romano, how can I help you?" />
      </View>
      <View style={styles.whiteSection}>
        <KeywordArea
          keywords={keywords}
          onKeywordPress={handleKeywordPress}
          services={['None', 'More']}
          onServicePress={handleServicePress}
          frequencies={frequencies}
        />
      </View>
      <View style={styles.blueSection}>
        <ResponseBubble text="I would like to make reservations." />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  eegchat: {
    fontSize: 24,
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '5%',
    fontFamily: 'Montserrat-Medium',
  },
  blueSection: {
    backgroundColor: '#3B29B5',
    flex: 1,
  },
  whiteSection: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
