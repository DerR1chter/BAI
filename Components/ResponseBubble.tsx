import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {ResponseBubbleProps} from '../types';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import axios from 'axios';
var Buffer = require('buffer/').Buffer;
import APIKeysConfig from '../APIKeysConfig';

const styles = StyleSheet.create({
  responseBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4945BD',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: 200,
    marginTop: 20,
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
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

const audioRecorderPlayer = new AudioRecorderPlayer();

export const ResponseBubble: React.FC<ResponseBubbleProps> = ({text}) => {
  const fetchAndPlaySpeech = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          voice: 'alloy',
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${APIKeysConfig.openAI}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      );

      const audioPath = `${RNFS.DocumentDirectoryPath}/response.mp3`;
      await RNFS.writeFile(
        audioPath,
        Buffer.from(response.data, 'binary').toString('base64'),
        'base64',
      );

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
    <View style={styles.responseBubble}>
      <Text style={styles.responseText}>{text}</Text>
      <TouchableOpacity onPress={fetchAndPlaySpeech}>
        <Image
          source={require('../assets/speaker.png')}
          style={styles.responseIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};
