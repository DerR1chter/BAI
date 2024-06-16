import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  ScrollView,
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

/**
 * InputBubble component - Manages recording, playing, and sending audio.
 * @param {InputBubbleProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
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
  knowledgeBase,
}: InputBubbleProps): JSX.Element => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPath, setAudioPath] = useState<string>('');
  const [recordTime, setRecordTime] = useState<string>('00:00');
  const [soundLevel, setSoundLevel] = useState<number>(0);
  const soundLevelAnim = useRef(new Animated.Value(0)).current; // Initial height is 0
  const [isMonitoringStarted, setIsMonitoringStarted] = useState(false);
  const {t, i18n} = useTranslation();
  const language = i18n?.language;

  // Request microphone permission and set up sound level monitoring
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
      const newHeight = Math.max(0, normalizedLevel * 0.4);
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
  }, []);

  /**
   * Starts audio recording.
   */
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

  /**
   * Stops audio recording and sends the audio to the Whisper service.
   */
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
      knowledgeBase,
    );
  };

  /**
   * Plays the recorded audio (currently not used in the app).
   */
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

  /**
   * Formats time from seconds to MM:SS format.
   * @param {number} totalSeconds - Total seconds to format.
   * @returns {string} - Formatted time string.
   */
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${padToTwo(minutes)}:${padToTwo(seconds)}`;
  };

  /**
   * Pads a number to two digits with leading zeros.
   * @param {number} number - The number to pad.
   * @returns {string} - Padded number string.
   */
  const padToTwo = (number: number) => number.toString().padStart(2, '0');

  return (
    <View style={styles.inputBubble}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
        }}>
        <Text style={styles.inputText}>
          {processedText.length > 0 ? processedText : text}
        </Text>
      </ScrollView>
      {isRecording && <Text style={styles.timerText}>{recordTime}</Text>}
      <TouchableOpacity
        style={styles.mic}
        onPress={isRecording ? onStopRecord : onStartRecord}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Image
          source={require('../assets/mic.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <Animated.View
          style={{
            position: 'absolute',
            width: '41%',
            bottom: 12,
            zIndex: 1,
            height: soundLevelAnim,
            borderRadius: 100,
            backgroundColor: 'rgba(72, 68, 189, 0.6)',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

// Styles for the InputBubble component
const styles = StyleSheet.create({
  inputBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#2A59B5',
    borderRadius: 25,
    padding: 15,
    paddingRight: 20,
    margin: 10,
    height: '65%',

    width: '90%',
    display: 'flex',
    alignSelf: 'center',
    position: 'relative',
    flexGrow: 1,
    marginBottom: 20,
  },
  inputText: {
    flex: 1,
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  inputIcon: {
    width: 48,
    height: 48,
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
