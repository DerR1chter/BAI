export interface InputBubbleProps {
    text: string;
    processedText: string;
    setProcessedText: (text: string) => void;
    setResponseOptions: (responseOptions: string[]) => void;
    waitingForResponse: boolean;
    setWaitingForResponse: (waitingForResponse: boolean) => void;
  }
  
  export interface KeywordProps {
    text: string;
    onKeywordPress: (keyword: string) => void;
  }
  
  export interface FrequencyProps {
    frequency: number;
    style: object;
  }

  export interface ServiceButtonProps {
    text: string;
    onPress: () => void;
    style?: object;
  }
  
  export interface ResponseBubbleProps {
    question: string;
    selectedResponse: string;
    fullResponse: string;
    setFullResponse: (fullResponse: string) => void;
    waitingForSpeechGeneration: boolean;
    setWaitingForSpeechGeneration: (waitingForResponse: boolean) => void;
    voice: string;
  }
  
  export interface KeywordAreaProps {
    keywords: string[];
    onKeywordPress: (keyword: string) => void;
    services: string[];
    onServicePress: (service: string) => void;
    waitingForResponse: boolean;
  }

  export interface FrequencyAreaProps {
    frequencyModeBackgroundColor: string;
    setFrequencyModeBackgroundColor: (color: string) => void;
  }
  
  export interface SettingsProps {
    voice: string;
    setVoice: (voice: string) => void;
  }