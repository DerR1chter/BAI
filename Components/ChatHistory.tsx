import React, {useEffect, useRef} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {ChatHistoryProps} from '../types';

/**
 * ChatHistory component - Displays the chat history.
 * @param {ChatHistoryProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ChatHistory: React.FC<ChatHistoryProps> = ({
  history,
}: ChatHistoryProps): JSX.Element => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  }, [history]);

  return (
    <ScrollView style={styles.historyContainer} ref={scrollViewRef}>
      {history.map((item, index) => (
        <View
          key={index}
          style={[
            styles.historyItem,
            item.role === 'Assistant' ? styles.assistantItem : styles.userItem,
          ]}>
          <Text style={styles.historyTextRole}>{item.role}: </Text>
          <Text style={styles.historyText}>{item.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles for the ChatHistory component
const styles = StyleSheet.create({
  historyContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  historyItem: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  assistantItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    paddingBottom: 0,
  },
  userItem: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
  },
  historyTextRole: {
    fontWeight: 'bold',
  },
  historyText: {
    flex: 1,
  },
});

export default ChatHistory;
