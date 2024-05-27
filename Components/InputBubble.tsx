import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {InputBubbleProps} from '../types';
import RNSoundLevel from 'react-native-sound-level';
import {Animated} from 'react-native';
import {sendAudioToWhisper} from '../Helpers/OpenAIService.ts';
import {useTranslation} from 'react-i18next';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const InputBubble: React.FC<InputBubbleProps> = ({
  text,
  processedText,
  setProcessedText,
  setResponseOptions,
  setCategory,
  waitingForResponse,
  setWaitingForResponse,
  setError,
  chatHistory,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string>('');
  const [recordTime, setRecordTime] = useState<string>('00:00');
  const [soundLevel, setSoundLevel] = useState<number>(0);
  const soundLevelAnim = useRef(new Animated.Value(0)).current; // Initial height is 0
  const [isMonitoringStarted, setIsMonitoringStarted] = useState(false);
  const {t, i18n} = useTranslation();
  const language = i18n?.language;

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const updateSoundLevel = (level: number) => {
      // Normalize level from -200 to 0 dB to a scale of 0 to 100 for display purposes
      const normalizedLevel = (level + 200) / 2;
      const newHeight = Math.max(0, normalizedLevel * 0.18);
      Animated.timing(soundLevelAnim, {
        toValue: newHeight,
        duration: 100,
        useNativeDriver: false,
      }).start();
    };

    requestPermission();

    RNSoundLevel.onNewFrame = data => {
      setSoundLevel(data.value); // sound level in decibels
      updateSoundLevel(data.value);
    };

    // return () => {
    //   if (isMonitoringStarted) {
    //     RNSoundLevel.stop();
    //     setIsMonitoringStarted(false);
    //   }
    // };
  }, []);

  const onStartRecord = async () => {
    setRecordTime('00:00');
    const path = `${
      RNFS.DocumentDirectoryPath
    }/hello_${new Date().getTime()}.mp3`;
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsIOS: 2,
    };
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    setAudioPath(uri);
    setIsRecording(true);
    RNSoundLevel.start();
    setIsMonitoringStarted(true);
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordTime(formatTime(Math.floor(e.currentPosition / 1000)));
      return;
    });
  };

  const onStopRecord = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    RNSoundLevel.stop();
    soundLevelAnim.setValue(0);
    sendAudioToWhisper(
      audioPath,
      setProcessedText,
      setResponseOptions,
      setCategory,
      setWaitingForResponse,
      language,
      setError,
      chatHistory,
    );
  };

  const onPlayAudio = async () => {
    if (!isPlaying) {
      await audioRecorderPlayer.startPlayer(audioPath);
      setIsPlaying(true);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          setIsPlaying(false);
        }
        return;
      });
    } else {
      await audioRecorderPlayer.stopPlayer();
      setIsPlaying(false);
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${padToTwo(minutes)}:${padToTwo(seconds)}`;
  };

  const padToTwo = (number: number) => number.toString().padStart(2, '0');

  return (
    <View style={styles.inputBubble}>
      <Text style={styles.inputText}>
        {processedText.length > 0 ? processedText : text}
      </Text>
      {isRecording && <Text style={styles.timerText}>{recordTime}</Text>}
      {/* <Text>Level: {soundLevel.toFixed(2)} dB</Text> */}
      <TouchableOpacity
        style={styles.mic}
        onPress={isRecording ? onStopRecord : onStartRecord}>
        <Image
          source={require('../assets/mic.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: '30%',
            bottom: 10,
            zIndex: 1,
            height: soundLevelAnim,
            borderRadius: 30,
            backgroundColor: 'rgba(72, 68, 189, 0.6)',
          }}
        />
      </TouchableOpacity>
      {audioPath && !isRecording && (
        <TouchableOpacity style={styles.playbackButton} onPress={onPlayAudio}>
          <Text style={styles.playbackText}>
            {isPlaying ? t('Stop') : t('Play')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#4945BD',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: 130,
    marginTop: 20,
    width: '90%',
    display: 'flex',
    alignSelf: 'center',
    position: 'relative',
  },
  inputText: {
    flex: 1,
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  inputIcon: {
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 14,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  playbackButton: {
    position: 'absolute',
    bottom: 20,
    right: 57,
  },
  playbackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  mic: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
