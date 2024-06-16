import AsyncStorage from '@react-native-async-storage/async-storage';
import knowledgeBaseJson from '../KnowledgeBase.json';

const KNOWLEDGE_BASE_KEY = 'KnowledgeBase';

/**
 * Loads the knowledge base from AsyncStorage. If `loadJson` is true or if there is no stored knowledge base,
 * it loads the knowledge base from the JSON file and stores it in AsyncStorage.
 * @param {boolean} [loadJson=false] - Whether to force loading the knowledge base from the JSON file.
 * @returns {Promise<any>} - The loaded knowledge base.
 */
export const loadKnowledgeBase = async (
  loadJson: boolean = false,
): Promise<any> => {
  try {
    const storedKnowledgeBase = await AsyncStorage.getItem(KNOWLEDGE_BASE_KEY);
    if (storedKnowledgeBase && !loadJson) {
      return JSON.parse(storedKnowledgeBase);
    } else {
      await AsyncStorage.setItem(
        KNOWLEDGE_BASE_KEY,
        JSON.stringify(knowledgeBaseJson),
      );
      return knowledgeBaseJson;
    }
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return knowledgeBaseJson;
  }
};

/**
 * Saves the provided knowledge base to AsyncStorage.
 * @param {any} knowledgeBase - The knowledge base to save.
 * @returns {Promise<void>}
 */
export const saveKnowledgeBase = async (knowledgeBase: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      KNOWLEDGE_BASE_KEY,
      JSON.stringify(knowledgeBase),
    );
  } catch (error) {
    console.error('Error saving knowledge base:', error);
  }
};
