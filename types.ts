export interface InputBubbleProps {
    text: string;
  }
  
  export interface KeywordProps {
    text: string;
    onPress: () => void;
  }
  
  export interface ServiceButtonProps {
    text: string;
    onPress: () => void;
  }
  
  export interface ResponseBubbleProps {
    text: string;
  }
  
  export interface KeywordAreaProps {
    keywords: string[];
    onKeywordPress: (keyword: string) => void;
    services: string[];
    onServicePress: (service: string) => void;
  }
  