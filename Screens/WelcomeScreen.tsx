import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import start from '../assets/start.png';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

// Define the types for the navigation stack parameters
type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
};

// Define the type for the navigation prop for the WelcomeScreen
type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

/**
 * WelcomeScreen component - The initial screen of the app.
 * Provides a welcome message and a button to navigate to the Main screen.
 */
const WelcomeScreen: React.FC = () => {
  // State to manage the listening status of the microphone
  const [isListening, setIsListening] = useState(false);

  // Navigation hook to navigate between screens
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  // Handle the press event of the start button
  const handleStartPress = () => {
    setIsListening(true);
    navigation.navigate('Main');
    setTimeout(() => setIsListening(false), 3000);
  };

  // Translation hook for internationalization
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.eegchat}>EEGChat</Text>
      <View style={styles.content}>
        <Text style={styles.greeting}>{t('Hi')} 👋</Text>
        <View style={styles.microphoneContainer}>
          <TouchableOpacity
            style={[
              styles.microphoneButton,
              isListening && styles.microphoneButtonActive,
            ]}
            onPress={handleStartPress}>
            <Image
              source={start}
              style={styles.microphoneIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {isListening && <View style={styles.pulsatingCircle} />}
          <Text style={styles.microphoneButtonText}>
            {t('Press_the_button')}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Styles for the WelcomeScreen component
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1246AC',
  },
  eegchat: {
    fontSize: 24,
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '5%',
    fontFamily: 'Montserrat-Medium',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  greeting: {
    fontSize: 48,
    color: '#FFFFFF',
    marginVertical: 24,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 50,
  },
  microphoneContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  microphoneButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#406EBC',
    width: 200,
    height: 200,
    borderRadius: 100,
    // elevation: 3,
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // shadowOffset: { height: 1, width: 0 },
  },
  microphoneButtonActive: {
    // Add styles for active state with pulsating effect
  },
  microphoneIcon: {
    width: 70,
    height: 70,
  },
  pulsatingCircle: {
    position: 'absolute',
    top: -25,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  microphoneButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 50,
    fontFamily: 'Montserrat-Medium',
  },
});

export default WelcomeScreen;
