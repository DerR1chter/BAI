import axios from 'axios';
import APIKeysConfig from '../APIKeysConfig';

export const sendAudioToWhisper = async (
  filePath: string,
  setProcessedText: (text: string) => void,
  setResponseOptions: (responseOptions: string[]) => void,
  setWaitingForResponse: (waitingForResponse: boolean) => void,
  language: string
) => {
  console.log("Language from: ", language)
  const fileUri = 'file://' + filePath;
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'audio/mp3',
    name: 'recording.mp3',
  });
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'text');
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
    generateResponseOptions(transcript, setResponseOptions, setWaitingForResponse);
    console.log('Transcript: ', transcript);
  } catch (error) {
    console.error('Error processing audio file:', error);
  }
};

const sendMessageToChatGPT = async (
  messages: {role: string; content: string}[],
  setWaitingForResponse: (waitingForResponse: boolean) => void
) => {
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
        model: 'gpt-4-turbo',
        messages: messages,
        max_tokens: 150,
        n: 1,
        stop: null,
      },
    });
    console.log('Response: ', response.data.choices[0].message.content);
    const options = response.data.choices[0].message.content;
    return options;
  } catch (error) {
    console.error('Error generating response options:', error);
  }
};


const generateResponseOptions = async (
  transcript: string,
  setResponseOptions: (options: string[]) => void,
  setWaitingForResponse: (waitingForResponse: boolean) => void
) => {
  const messages = [
          {
            role: 'system',
            content:
              'You are a helpful assistant helping a disabled person to generate a full sentence based on a selected keyword. Your task is to generate up to 6 SINGLE words (depending on the question) that could be suitable responses to the question from below. Always provide a variety of responses, giving the user alternative options to choose from, including negative reponses (for instance, always add "Not good" or "Bad" if the person is asked how they feel). ALWAYS provide the answers as a list of SINGLE words, not numerated and separated by comma. Here is the question:',
          },
          {
            role: 'user',
            content: transcript,
          },
        ];
    const response = await sendMessageToChatGPT(messages, setWaitingForResponse);
    const options = response.split(',').map((option: string) => option.trim());
    setResponseOptions(options);
    setWaitingForResponse(false);
  };




export const regenerateResponseOptions = async (
  originalRequest: string,
  providedResponse: string[],
  setResponseOptions: (options: string[]) => void,
  setWaitingForResponse: (waitingForResponse: boolean) => void
) => {
    const messages = [
            {
              role: 'system',
              content:
                'You are a helpful assistant helping a disabled person to generate a full sentence based on a selected keyword. Your task is to generate up to 6 SINGLE words (depending on the question) that could be suitable responses to the question from below. Always provide a variety of responses, giving the user alternative options to choose from, including negative reponses (for instance, always add "Not good" or "Bad" if the person is asked how they feel). ALWAYS provide the answers as a list of SINGLE words, not numerated and separated by comma. Here is the question:',
            },
            {
              role: 'user',
              content: originalRequest,
            },
            {
              role: 'system',
              content: providedResponse.join(', '),
            },
            {
              role: 'user',
              content: 'Please, provide me with more options.',
            },
    ];
    const response = await sendMessageToChatGPT(messages, setWaitingForResponse);
    const options = response.split(',').map((option: string) => option.trim());
    setResponseOptions(options);
    setWaitingForResponse(false);
};


export const generateFullResponse = async (questionArg: string, answer: string, setFullResponse: (fullResponse: string) => void, setWaitingForSpeechGeneration: (waitingForResponse: boolean) => void) => {
  const messages = [
    {
      role: 'system',
      content:
        "You are a helpful assistant helping a disabled person to generate a full sentence based on a selected keyword. When generating responses, always adopt the perspective of the person who chose the response word, not the AI's perspective.",
    },
    {
      role: 'user',
      content: `Question: ${questionArg}`,
    },
    {
      role: 'user',
      content: `Selected word: ${answer}`,
    },
    {
      role: 'system',
      content:
        'Given the question and the selected word, generate a full, coherent response as if you are the person responding. Incorporate the selected word and appropriately address the question.',
    },
  ];
    const response = await sendMessageToChatGPT(messages, setWaitingForSpeechGeneration);
    const fullResponse = response.trim();
    setFullResponse(fullResponse);
    setWaitingForSpeechGeneration(false);
};

export const generateAnswerForChangingTopic = async (
  originalRequest: string,
  providedResponse: string[],
  setFullResponse: (fullResponse: string) => void,
  setWaitingForSpeechGeneration: (waitingForSpeechGeneration: boolean) => void
) => {
    const messages = [
            {
              role: 'system',
              content:
              "You are a helpful assistant helping a disabled person to generate a full sentence based on a selected keyword. When generating responses, always adopt the perspective of the person who chose the response word, not the AI's perspective. The user has asked to change the topic. You should generate a complete sentece that indicates the intention to change the topic. Do not suggest any new topics, just show the wish to change it. Here is the original question you need to mention: ",
            },
            {
              role: 'user',
              content: originalRequest,
            },
    ];
    const response = await sendMessageToChatGPT(messages, setWaitingForSpeechGeneration);
    const fullResponse = response.trim();
    setFullResponse(fullResponse);
    setWaitingForSpeechGeneration(false);
};



export const fetchSpeech = async (text: string, voice: string) => {
  console.log("Text: ", text)
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
