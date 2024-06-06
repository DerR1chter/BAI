import AsyncStorage from '@react-native-async-storage/async-storage';
import knowledgeBaseJson from '../KnowledgeBase.json'; 

const KNOWLEDGE_BASE_KEY = 'KnowledgeBase';

export const loadKnowledgeBase = async (loadJson: boolean = false) => {
  try {
    const storedKnowledgeBase = await AsyncStorage.getItem(KNOWLEDGE_BASE_KEY);
    if (storedKnowledgeBase && !loadJson) {
      return JSON.parse(storedKnowledgeBase);
    } else {
      await AsyncStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(knowledgeBaseJson));
      return knowledgeBaseJson;
    }
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return knowledgeBaseJson;
  }
};

export const saveKnowledgeBase = async (knowledgeBase: any) => {
  try {
    await AsyncStorage.setItem(KNOWLEDGE_BASE_KEY, JSON.stringify(knowledgeBase));
  } catch (error) {
    console.error('Error saving knowledge base:', error);
  }
};
