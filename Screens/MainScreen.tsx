import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text, Switch} from 'react-native';
import {InputBubble} from '../Components/InputBubble';
import {KeywordArea} from '../Components/KeywordArea';
import {ResponseBubble} from '../Components/ResponseBubble';
import {Settings} from './Settings';
import {FrequencyArea} from '../Components/FrequencyArea';
import {
  generateAnswerForChangingTopic,
  regenerateResponseOptions,
} from '../Helpers/OpenAIService';
import {useTranslation} from 'react-i18next';

const MainScreen: React.FC = () => {
  const [processedText, setProcessedText] = useState<string>('');
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);
  const [waitingForSpeechGeneration, setWaitingForSpeechGeneration] =
    useState<boolean>(false);
  const [responseOptions, setResponseOptions] = useState<string[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [fullResponse, setFullResponse] = useState<string>('');
  const [isFrequencyCheckingMode, setIsFrequencyCheckingMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState('English');
  const [voice, setVoice] = useState('male');
  const [frequencyModeBackgroundColor, setFrequencyModeBackgroundColor] =
    useState('#000000');

  const handleSettingsChange = (newLanguage: string, newVoice: string) => {
    setLanguage(newLanguage);
    setVoice(newVoice);
    setModalVisible(false);
  };

  const handleServicePress = (service: string) => {
    if (service === 'More') {
      setFullResponse('');
      regenerateResponseOptions(
        processedText,
        responseOptions,
        setResponseOptions,
        setWaitingForResponse,
      );
    }
    if (service === 'Change topic') {
      setSelectedResponse('');
      setFullResponse('');
      generateAnswerForChangingTopic(
        processedText,
        responseOptions,
        setFullResponse,
        setWaitingForSpeechGeneration,
      );
    }
  };

  useEffect(() => {
    if (waitingForResponse) {
      setFullResponse('');
    } else if (waitingForSpeechGeneration) {
      setResponseOptions([]);
    }
  }, [waitingForResponse, waitingForSpeechGeneration]);

  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.switchContainer,
          isFrequencyCheckingMode && {
            backgroundColor: frequencyModeBackgroundColor,
          },
        ]}>
        <Text style={styles.switchLabel}>{t('Frequency_checking_mode')}</Text>
        <Switch
          trackColor={{false: '#FFFFFF', true: '#FFFFFF'}}
          thumbColor={isFrequencyCheckingMode ? '#7A82E2' : '#7A82E2'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={newValue => {
            setProcessedText('');
            setSelectedResponse('');
            setFullResponse('');
            setIsFrequencyCheckingMode(newValue);
          }}
          value={isFrequencyCheckingMode}
        />
      </View>
      {isFrequencyCheckingMode ? (
        <FrequencyArea
          frequencyModeBackgroundColor={frequencyModeBackgroundColor}
          setFrequencyModeBackgroundColor={setFrequencyModeBackgroundColor}
        />
      ) : (
        <>
          <View style={styles.settingsContainer}>
            <Settings voice={voice} setVoice={setVoice} />
          </View>
          <View
            style={[
              styles.mainContainer,
              modalVisible && styles.mainContainerCovered,
            ]}>
            <View style={styles.blueSectionOne}>
              <Text style={styles.eegchat}>EEGChat</Text>

              <InputBubble
                text={t('Press_the_mic')}
                processedText={processedText}
                setProcessedText={setProcessedText}
                setResponseOptions={setResponseOptions}
                waitingForResponse={waitingForResponse}
                setWaitingForResponse={setWaitingForResponse}
              />
            </View>
            <View style={styles.whiteSection}>
              <KeywordArea
                keywords={responseOptions}
                onKeywordPress={setSelectedResponse}
                services={['Change topic', 'More']}
                onServicePress={handleServicePress}
                waitingForResponse={waitingForResponse}
              />
            </View>
            <View style={styles.blueSectionTwo}>
              <ResponseBubble
                question={processedText}
                selectedResponse={selectedResponse}
                fullResponse={fullResponse}
                setFullResponse={setFullResponse}
                waitingForSpeechGeneration={waitingForSpeechGeneration}
                setWaitingForSpeechGeneration={setWaitingForSpeechGeneration}
                voice={voice}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingsContainer: {
    display: 'flex',
    backgroundColor: '#3B29B5',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#3B29B5',
  },
  mainContainerCovered: {
    flex: 1,
    backgroundColor: '#1246AC !important',
    zIndex: 1,
    opacity: 1,
  },

  eegchat: {
    fontSize: 24,
    color: '#FFFFFF',
    alignSelf: 'center',
    marginTop: '5%',
    fontFamily: 'Montserrat-Medium',
  },
  blueSectionOne: {
    backgroundColor: '#3B29B5',
    flex: 1,
    marginBottom: 30,
  },
  whiteSection: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueSectionTwo: {
    backgroundColor: '#3B29B5',
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A2BB5',
  },
  switchFreqContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  switchLabel: {
    marginRight: 10,
    color: '#FFFFFF',
  },
  colorPicker: {
    width: 250,
    height: 250,
  },
});

export default MainScreen;
