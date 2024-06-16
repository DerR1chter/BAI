import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {InputBubble} from '../Components/InputBubble';
import {KeywordArea} from '../Components/KeywordArea';
import {ResponseBubble} from '../Components/ResponseBubble';
import {Settings} from './Settings';
import {FrequencyArea} from '../Components/FrequencyArea';
import {regenerateResponseOptions} from '../Helpers/OpenAIService.ts';
import {useTranslation} from 'react-i18next';
import {ChatMessage, KnowledgeBase} from '../types';
import ChatHistory from '../Components/ChatHistory';
import {
  loadKnowledgeBase,
  saveKnowledgeBase,
} from '../Helpers/KnowledgeBaseLoader.ts';

/**
 * MainScreen component - The primary screen for the chat application.
 * This component manages the state and handles the interaction between different components.
 */
const MainScreen: React.FC = () => {
  // State variables
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

  // Load the knowledge base on component mount
  useEffect(() => {
    const initializeKnowledgeBase = async () => {
      const kb = await loadKnowledgeBase();
      setKnowledgeBase(kb);
    };

    initializeKnowledgeBase();
  }, []);

  // Handle new chat messages
  const handleNewMessage = (role: ChatMessage['role'], text: string) => {
    setChatHistory(prevHistory => [...prevHistory, {role, text}]);
  };

  // Restart the conversation
  const restartConversation = () => {
    setChatHistory([]);
    setProcessedText('');
    setSelectedResponse('');
    setFullResponse('');
    setResponseOptions([]);
  };

  // Update chat history when processedText changes
  useEffect(() => {
    if (processedText.length > 0 && processedText !== lastProcessedText) {
      handleNewMessage('Assistant', processedText);
      setLastProcessedText(processedText);
    }
  }, [processedText]);

  // Update chat history when fullResponse changes
  useEffect(() => {
    if (fullResponse.length > 0 && fullResponse !== lastFullResponse) {
      handleNewMessage('User', fullResponse);
      setLastFullResponse(fullResponse);
    }
  }, [fullResponse]);

  // Handle service button presses
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
    if (service === 'Correction') {
      setSelectedResponse('');
      setFullResponse(
        'Sorry, I misspoke earlier. Please, ask your question again.',
      );
    }
    if (service === 'None') {
      setSelectedResponse('');
      setFullResponse('I cannot answer this question right now.');
    }
    if (service === 'Finished') {
      setSelectedResponse('');
      setFullResponse('Thank you, goodbye.');
      setChatHistory([]);
      setTimeout(() => {
        restartConversation();
        setProcessedText(t('Press_the_mic'));
      }, 3000);
    }
  };

  // Reset full response when waiting for a response
  useEffect(() => {
    if (waitingForResponse) {
      setFullResponse('');
    }
  }, [waitingForResponse, waitingForSpeechGeneration]);

  // Translation hook
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsContainer}>
        <Settings
          voice={voice}
          setVoice={setVoice}
          isFrequencyCheckingMode={isFrequencyCheckingMode}
          setIsFrequencyCheckingMode={setIsFrequencyCheckingMode}
          knowledgeBase={knowledgeBase}
          setKnowledgeBase={setKnowledgeBase}
        />
      </View>
      {isFrequencyCheckingMode ? (
        <FrequencyArea
          frequencyModeBackgroundColor={frequencyModeBackgroundColor}
          setFrequencyModeBackgroundColor={setFrequencyModeBackgroundColor}
        />
      ) : (
        <>
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
              <KeywordArea
                keywords={responseOptions}
                onKeywordPress={setSelectedResponse}
                services={['Correction', 'More', 'None', 'Finished']}
                onServicePress={handleServicePress}
                waitingForResponse={waitingForResponse}
              />
              {/* Uncomment the following code to display chat history and restart conversation button
              {responseOptions.length === 0 && (
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

// Styles for the MainScreen component
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
    fontFamily: 'Montserrat-Medium',
  },
  blueSectionOne: {
    backgroundColor: '#1246AC',
    flex: 1,
    alignItems: 'center',
  },
  whiteSection: {
    flex: 2.2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
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
