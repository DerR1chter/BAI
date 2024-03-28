// WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen: React.FC = () => {
  // Placeholder function for microphone press action
  const handleMicrophonePress = () => {
    // TODO: Integrate with voice recognition service
    console.log('Microphone button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi 👋</Text>
      <TouchableOpacity
        style={styles.microphoneButton}
        onPress={handleMicrophonePress}
      >
        <Text style={styles.microphoneButtonText}>Press the microphone</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3450A1', // Example color for the background
  },
  greeting: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  microphoneButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: '#4F6D7A', // Example color for the button
    borderRadius: 50,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 1, width: 0 },
  },
  microphoneButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
