import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {ResponseBubbleProps} from '../types';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
var Buffer = require('buffer/').Buffer;
import speaker from '../assets/speaker.png';
import {fetchSpeech, generateFullResponse} from '../Helpers/OpenAIService.ts';

// Create a new instance of the audio recorder player
const audioRecorderPlayer = new AudioRecorderPlayer();

/**
 * ResponseBubble component - Displays the full response and plays the speech.
 * @param {ResponseBubbleProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const ResponseBubble: React.FC<ResponseBubbleProps> = ({
  question,
  selectedResponse,
  fullResponse,
  setFullResponse,
  waitingForSpeechGeneration,
  setWaitingForSpeechGeneration,
  voice,
  chatHistory,
}: ResponseBubbleProps): JSX.Element => {
  useEffect(() => {
    if (selectedResponse.length > 0) {
      generateFullResponse(
        question,
        selectedResponse,
        setFullResponse,
        setWaitingForSpeechGeneration,
        chatHistory,
      );
    }
  }, [selectedResponse]);

  useEffect(() => {
    if (fullResponse.length > 0) {
      fetchAndPlaySpeech(fullResponse);
    }
  }, [fullResponse]);

  /**
   * Fetches and plays the speech for the given response.
   * @param {string} fullResponseArg - The full response text.
   */
  const fetchAndPlaySpeech = async (fullResponseArg: string) => {
    try {
      const response = await fetchSpeech(fullResponseArg, voice);

      const audioPath = `${RNFS.DocumentDirectoryPath}/response.mp3`;
      await RNFS.writeFile(
        audioPath,
        Buffer.from(response.data, 'binary').toString('base64'),
        'base64',
      );

      await audioRecorderPlayer.stopPlayer();
      await audioRecorderPlayer.startPlayer(audioPath);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
        }
      });
    } catch (error) {
      console.error('Error fetching or playing speech:', error);
    }
  };

  return (
    <View
      style={[
        styles.responseBubble,
        waitingForSpeechGeneration && styles.activityIndicator,
      ]}>
      {waitingForSpeechGeneration ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.responseText}>{fullResponse}</Text>
          </ScrollView>
          <TouchableOpacity
            onPress={() => fetchAndPlaySpeech(fullResponse)}
            disabled={fullResponse.length < 1}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Image
              source={speaker}
              style={[
                styles.responseIcon,
                fullResponse.length < 1 && styles.noResponse,
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Styles for the ResponseBubble component
const styles = StyleSheet.create({
  responseBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2A59B5',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: '50%',
    marginTop: 20,
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
    position: 'relative',
    flexGrow: 1,
  },
  activityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResponse: {
    opacity: 0.5,
  },
  responseText: {
    flex: 1,
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
  },
  responseIcon: {
    width: 48,
    height: 48,
    alignSelf: 'flex-end',
  },
});
