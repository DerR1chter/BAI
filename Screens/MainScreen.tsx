import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Switch,
  Button,
} from 'react-native';
import {InputBubble} from '../Components/InputBubble';
import {KeywordArea} from '../Components/KeywordArea';
import {ResponseBubble} from '../Components/ResponseBubble';
import {Settings} from './Settings';
import {FrequencyArea} from '../Components/FrequencyArea';
import {
  generateAnswerForChangingTopic,
  regenerateResponseOptions,
} from '../Helpers/OpenAIService.ts';
import {useTranslation} from 'react-i18next';
import {ChatMessage, KnowledgeBase} from '../types';
import ChatHistory from '../Components/ChatHistory';
import {ServiceButton} from '../Components/ServiceButton';
import {
  loadKnowledgeBase,
  saveKnowledgeBase,
} from '../Helpers/KnowledgeBaseLoader.ts';
import KnowledgeBaseManager from './KnowledgeBaseManager.tsx';

const MainScreen: React.FC = () => {
  const [processedText, setProcessedText] = useState<string>('');
  const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);
  const [waitingForSpeechGeneration, setWaitingForSpeechGeneration] =
    useState<boolean>(false);
  const [responseOptions, setResponseOptions] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [selectedResponse, setSelectedResponse] = useState<string>('');
  const [fullResponse, setFullResponse] = useState<string>('');
  const [isFrequencyCheckingMode, setIsFrequencyCheckingMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [voice, setVoice] = useState('male');
  const [frequencyModeBackgroundColor, setFrequencyModeBackgroundColor] =
    useState('#000000');
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [lastProcessedText, setLastProcessedText] = useState<string>('');
  const [lastFullResponse, setLastFullResponse] = useState<string>('');
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({});

  useEffect(() => {
    const initializeKnowledgeBase = async () => {
      const kb = await loadKnowledgeBase();
      setKnowledgeBase(kb);
    };

    initializeKnowledgeBase();
  }, []);

  const handleNewMessage = (role: ChatMessage['role'], text: string) => {
    setChatHistory(prevHistory => [...prevHistory, {role, text}]);
  };

  const restartConversation = () => {
    setChatHistory([]);
    setProcessedText('');
    setSelectedResponse('');
    setFullResponse('');
  };

  useEffect(() => {
    if (processedText.length > 0 && processedText !== lastProcessedText) {
      handleNewMessage('Assistant', processedText);
      setLastProcessedText(processedText);
    }
  }, [processedText]);

  useEffect(() => {
    if (fullResponse.length > 0 && fullResponse !== lastFullResponse) {
      handleNewMessage('User', fullResponse);
      setLastFullResponse(fullResponse);
    }
  }, [fullResponse]);

  const handleServicePress = (service: string) => {
    if (service === 'More') {
      setFullResponse('');
      regenerateResponseOptions(
        processedText,
        responseOptions,
        setResponseOptions,
        setCategory,
        setWaitingForResponse,
        chatHistory,
        knowledgeBase,
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
    }
    // else if (waitingForSpeechGeneration) {
    //   setResponseOptions([]);
    // }
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
          thumbColor={'#668EDA'}
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
            <Settings
              voice={voice}
              setVoice={setVoice}
              knowledgeBase={knowledgeBase}
              setKnowledgeBase={setKnowledgeBase}
            />
          </View>
          <View
            style={[
              styles.mainContainer,
              modalVisible && styles.mainContainerCovered,
            ]}>
            <View style={styles.blueSectionOne}>
              {/* <Text style={styles.eegchat}>EEGChat</Text> */}

              <InputBubble
                text={t('Press_the_mic')}
                processedText={processedText}
                setProcessedText={setProcessedText}
                setResponseOptions={setResponseOptions}
                setCategory={setCategory}
                waitingForResponse={waitingForResponse}
                setWaitingForResponse={setWaitingForResponse}
                setError={setError}
                chatHistory={chatHistory}
                knowledgeBase={knowledgeBase}
              />
            </View>
            <View style={styles.whiteSection}>
              {error.length > 0 && <Text>{error}</Text>}
              <KnowledgeBaseManager
                knowledgeBase={knowledgeBase}
                setKnowledgeBase={setKnowledgeBase}
                modalVisible={true}
                setModalVisible={() => {}}
              />
              {/* <KeywordArea
                keywords={responseOptions}
                onKeywordPress={setSelectedResponse}
                services={['Correction', 'More', 'None', 'Finished']}
                onServicePress={handleServicePress}
                waitingForResponse={waitingForResponse}
              /> */}
              {/* {responseOptions.length === 0 && (
                <>
                  <ChatHistory history={chatHistory} />
                  {chatHistory.length > 0 && (
                    <ServiceButton
                      text="Restart Conversation"
                      onPress={restartConversation}
                    />
                  )}
                </>
              )} */}
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
                chatHistory={chatHistory}
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
    backgroundColor: '#1246AC',
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#1246AC',
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
    // marginTop: '5%',
    fontFamily: 'Montserrat-Medium',
  },
  blueSectionOne: {
    backgroundColor: '#1246AC',
    flex: 1,
    alignItems: 'center',
    // marginBottom: 30,
  },
  whiteSection: {
    flex: 2.2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueSectionTwo: {
    backgroundColor: '#1246AC',
    flex: 0.8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1246AC',
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
