import axios from 'axios';
import APIKeysConfig from '../Configs/APIKeysConfig';
import {ChatMessage, KnowledgeBase} from '../types';
import promptConfig from '../Configs/promptConfig';

const MODEL_ID =
  'ft:gpt-3.5-turbo-0613:rg-neuroinformatics:ft-hq-new-default:8sCkSlVq';
const TEMPERATURE = 0.3;

/**
 * Sends an audio file to the Whisper API for transcription.
 * @param {string} filePath - The path to the audio file.
 * @param {(text: string) => void} setProcessedText - Function to set the processed text.
 * @param {(responseOptions: string[]) => void} setResponseOptions - Function to set response options.
 * @param {(category: string) => void} setCategory - Function to set the response category.
 * @param {(waitingForResponse: boolean) => void} setWaitingForResponse - Function to set the waiting state.
 * @param {string} language - The language of the audio file.
 * @param {(error: string) => void} setError - Function to set the error message.
 * @param {ChatMessage[]} chatHistory - The chat history.
 * @param {KnowledgeBase} knowledgeBase - The knowledge base.
 */
export const sendAudioToWhisper = async (
  filePath: string,
  setProcessedText: (text: string) => void,
  setResponseOptions: (responseOptions: string[]) => void,
  setCategory: (category: string) => void,
  setWaitingForResponse: (waitingForResponse: boolean) => void,
  language: string,
  setError: (error: string) => void,
  chatHistory: ChatMessage[],
  knowledgeBase: KnowledgeBase,
) => {
  setError('');
  const fileUri = 'file://' + filePath;
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'audio/mp3',
    name: 'recording.mp3',
  });
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'text');
  const supportedLanguages = ['en', 'de'];
  if (!supportedLanguages.includes(language)) {
    language = 'en';
  }
  formData.append('language', language);

  setWaitingForResponse(true);

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/audio/transcriptions',
      data: formData,
      headers: {
        Authorization: `Bearer ${APIKeysConfig.openAI}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    const transcript = response.data;
    setProcessedText(transcript);
    generateResponseOptions(
      transcript,
      setResponseOptions,
      setCategory,
      setWaitingForResponse,
      chatHistory,
      knowledgeBase,
    );
  } catch (error) {
    setError(`Plese, try again.`);
    console.error('Error processing audio file:', error);
    setWaitingForResponse(false);
  }
};

/**
 * Sends a message to the ChatGPT API and returns the response options.
 * @param {Array<{role: string; content: string}>} messages - The messages to send.
 * @param {(waitingForResponse: boolean) => void} setWaitingForResponse - Function to set the waiting state.
 * @param {boolean} [useFineTunedModel=false] - Whether to use the fine-tuned model.
 * @returns {Promise<string>} The response options.
 */
const sendMessageToChatGPT = async (
  messages: {role: string; content: string}[],
  setWaitingForResponse: (waitingForResponse: boolean) => void,
  useFineTunedModel: boolean = false,
): Promise<string | undefined> => {
  try {
    setWaitingForResponse(true);
    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        Authorization: `Bearer ${APIKeysConfig.openAI}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: useFineTunedModel ? MODEL_ID : 'gpt-4o',
        messages: messages,
        temperature: useFineTunedModel ? TEMPERATURE : 1,
        max_tokens: 150,
        n: 1,
        stop: null,
      },
    });
    const options = response.data.choices[0].message.content;
    return options;
  } catch (error) {
    console.error('Error generating response options:', error);
    return undefined;
  }
};

/**
 * Generates response options based on the transcript and updates the state.
 * @param {string} transcript - The transcript of the audio.
 * @param {(options: string[]) => void} setResponseOptions - Function to set response options.
 * @param {(category: string) => void} setCategory - Function to set the response category.
 * @param {(waitingForResponse: boolean) => void} setWaitingForResponse - Function to set the waiting state.
 * @param {ChatMessage[]} chatHistory - The chat history.
 * @param {KnowledgeBase} knowledgeBase - The knowledge base.
 * @param {number} retryCount - The current retry count.
 */
const generateResponseOptions = async (
  transcript: string,
  setResponseOptions: (options: string[]) => void,
  setCategory: (category: string) => void,
  setWaitingForResponse: (waitingForResponse: boolean) => void,
  chatHistory: ChatMessage[],
  knowledgeBase: KnowledgeBase,
  retryCount: number = 0,
) => {
  if (retryCount > 3) {
    console.error(
      'Max retry attempts reached. Cannot generate response options.',
    );
    setWaitingForResponse(false);
    return;
  }

  const historyMessages = constructMessage(chatHistory);
  const prompt = promptConfig.prompt;
  const messages = [
    {
      role: 'system',
      content: prompt,
    },
    ...historyMessages,
    {
      role: 'system',
      content: 'Here is the question:',
    },
    {
      role: 'user',
      content: transcript,
    },
  ];

  chatHistory.pop();
  const response = await sendMessageToChatGPT(messages, setWaitingForResponse);

  if (response === undefined) {
    console.error('Error in generating response options. Retrying...');
    generateResponseOptions(
      transcript,
      setResponseOptions,
      setCategory,
      setWaitingForResponse,
      chatHistory,
      knowledgeBase,
      retryCount + 1,
    );
    return;
  }

  try {
    let {options, category} = parseResponse(response);
    if (knowledgeBase[category as keyof typeof knowledgeBase]) {
      options = knowledgeBase[category as keyof typeof knowledgeBase];
      options = options.slice(0, 6);
    }
    setResponseOptions(options);
    setCategory(category);
    setWaitingForResponse(false);
  } catch (error) {
    console.error('Error parsing response:', error);
    generateResponseOptions(
      transcript,
      setResponseOptions,
      setCategory,
      setWaitingForResponse,
      chatHistory,
      knowledgeBase,
      retryCount + 1,
    );
  }
};

/**
 * Regenerates response options based on the original request and updates the state.
 * @param {string} originalRequest - The original request.
 * @param {string[]} providedResponse - The provided response options.
 * @param {(options: string[]) => void} setResponseOptions - Function to set response options.
 * @param {(category: string) => void} setCategory - Function to set the response category.
 * @param {(waitingForResponse: boolean) => void} setWaitingForResponse - Function to set the waiting state.
 * @param {ChatMessage[]} chatHistory - The chat history.
 * @param {KnowledgeBase} knowledgeBase - The knowledge base.
 */
export const regenerateResponseOptions = async (
  originalRequest: string,
  providedResponse: string[],
  setResponseOptions: (options: string[]) => void,
  setCategory: (category: string) => void,
  setWaitingForResponse: (waitingForResponse: boolean) => void,
  chatHistory: ChatMessage[],
  knowledgeBase: KnowledgeBase,
) => {
  chatHistory.push({
    role: 'User',
    text: `Your provided keywords: ${providedResponse}. Please generate new keywords that don't repeat the previous once.`,
  });
  generateResponseOptions(
    originalRequest,
    setResponseOptions,
    setCategory,
    setWaitingForResponse,
    chatHistory,
    knowledgeBase,
  );
};

/**
 * Generates a full response based on the question and selected answer, then updates the state.
 * @param {string} questionArg - The question asked.
 * @param {string} answer - The selected answer.
 * @param {(fullResponse: string) => void} setFullResponse - Function to set the full response.
 * @param {(waitingForResponse: boolean) => void} setWaitingForSpeechGeneration - Function to set the waiting state.
 * @param {ChatMessage[]} chatHistory - The chat history.
 */
export const generateFullResponse = async (
  questionArg: string,
  answer: string,
  setFullResponse: (fullResponse: string) => void,
  setWaitingForSpeechGeneration: (waitingForResponse: boolean) => void,
  chatHistory: ChatMessage[],
) => {
  const formattedChatHistory = formatChatHistory(chatHistory);
  const prompt = `${formattedChatHistory}
    Question: ${questionArg}
    Keywords: ${answer}
    Answer:\n\n###\n\n`;

  const response = await sendMessageToChatGPT(
    [{role: 'user', content: prompt}],
    setWaitingForSpeechGeneration,
    true,
  );

  if (response === undefined) {
    console.error('Failed to generate a full response.');
    setFullResponse(
      'There was an error generating response. Please try again.',
    );
  } else {
    const fullResponse = response.replace(/ END$/, '').trim();
    setFullResponse(fullResponse);
  }

  setWaitingForSpeechGeneration(false);
};

/**
 * Fetches speech audio for the given text.
 * @param {string} text - The text to convert to speech.
 * @param {string} voice - The voice to use for the speech.
 * @returns {Promise<any>} The speech audio data.
 */
export const fetchSpeech = async (
  text: string,
  voice: string,
): Promise<any> => {
  return await axios.post(
    'https://api.openai.com/v1/audio/speech',
    {
      model: 'tts-1',
      voice: voice === 'male' ? 'echo' : 'nova',
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
};

/**
 * Constructs messages from the chat history.
 * @param {ChatMessage[]} chatHistory - The chat history.
 * @returns {Array<{role: string; content: string}>} The constructed messages.
 */
const constructMessage = (
  chatHistory: ChatMessage[],
): {role: string; content: string}[] => {
  const startMarker = {
    role: 'user',
    content: 'Conversation history begin:',
  };

  const endMarker = {
    role: 'user',
    content: 'Conversation history end.',
  };

  const historyMessages = chatHistory.map(message => ({
    role: 'user',
    content: `${message.role}: ${message.text}`,
  }));

  return [startMarker, ...historyMessages, endMarker];
};

/**
 * Parses the response from the ChatGPT API to extract options and category.
 * @param {string} responseContent - The response content from the API.
 * @returns {{options: string[], category: string}} The parsed options and category.
 * @throws {Error} If the response format is incorrect.
 */
const parseResponse = (
  responseContent: string,
): {options: string[]; category: string} => {
  const answersMatch = responseContent.match(
    /Answers: ([\s\S]*?)\nCategory: ([\s\S]*)/,
  );
  if (answersMatch) {
    const options = answersMatch[1].split(',').map(option => option.trim());
    const category = answersMatch[2].trim();
    return {options, category};
  } else {
    throw new Error('Response format is incorrect.');
  }
};

/**
 * Formats the chat history into a string.
 * @param {ChatMessage[]} chatHistory - The chat history.
 * @returns {string} The formatted chat history.
 */
const formatChatHistory = (chatHistory: ChatMessage[]): string => {
  return chatHistory
    .map((message, index) => {
      if (message.role.toLowerCase() === 'user') {
        return `Answer: ${message.text.trim()}`;
      } else if (message.role.toLowerCase() === 'assistant') {
        return `Question: ${message.text.trim()}`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
};
