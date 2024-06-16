export interface InputBubbleProps {
  text: string;
  processedText: string;
  setProcessedText: (text: string) => void;
  setResponseOptions: (responseOptions: string[]) => void;
  setCategory: (category: string) => void;
  waitingForResponse: boolean;
  setWaitingForResponse: (waitingForResponse: boolean) => void;
  setError: (error: string) => void;
  chatHistory: ChatMessage[];
  knowledgeBase: KnowledgeBase;
}

export interface KeywordProps {
  text: string;
  onKeywordPress: (keyword: string) => void;
}

export interface FrequencyProps {
  frequency: number;
  style: object;
}

export type ServiceType = 'Correction' | 'More' | 'None' | 'Finished';

export type SettingType =
  | 'English'
  | 'German'
  | 'Male'
  | 'Female'
  | 'Manage Knowledge Base'
  | 'Yes'
  | 'No';

export interface ServiceButtonProps {
  text: ServiceType;
  onPress: () => void;
  style?: object;
}

export interface SettingsButtonProps {
  text: SettingType;
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
  chatHistory: ChatMessage[];
}

export interface KeywordAreaProps {
  keywords: string[];
  onKeywordPress: (keyword: string) => void;
  services: ServiceType[];
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
  isFrequencyCheckingMode: boolean;
  setIsFrequencyCheckingMode: (isFrequencyCheckingMode: boolean) => void;
  knowledgeBase: KnowledgeBase;
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBase>>;
}

export interface ChatMessage {
  role: 'Assistant' | 'User';
  text: string;
}

export interface ChatHistoryProps {
  history: ChatMessage[];
}

export type KnowledgeBase = {
  [key: string]: string[];
};

export interface ConfirmationModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export interface KnowledgeBaseManagerProps {
  knowledgeBase: KnowledgeBase;
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBase>>;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
