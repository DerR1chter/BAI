import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {ChatHistoryProps} from '../types';

const ChatHistory: React.FC<ChatHistoryProps> = ({history}) => {
  return (
    <ScrollView style={styles.historyContainer}>
      {history.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.historyTextRole}>{item.role}: </Text>
          <Text style={styles.historyText}>{item.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  historyTextRole: {
    fontWeight: 'bold',
  },
  historyText: {
    flex: 1,
  },
});

export default ChatHistory;
