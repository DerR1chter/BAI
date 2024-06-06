import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ResponseBubbleProps} from '../types';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
var Buffer = require('buffer/').Buffer;
import speaker from '../assets/speaker.png';
import {fetchSpeech, generateFullResponse} from '../Helpers/OpenAIService.ts';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const ResponseBubble: React.FC<ResponseBubbleProps> = ({
  question,
  selectedResponse,
  fullResponse,
  setFullResponse,
  waitingForSpeechGeneration,
  setWaitingForSpeechGeneration,
  voice,
  chatHistory,
}) => {
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
          <Text style={styles.responseText}>{fullResponse}</Text>
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

const styles = StyleSheet.create({
  responseBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#4945BD',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: 160,
    marginTop: 20,
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
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
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
});
