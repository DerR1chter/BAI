import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

import settingsIcon from '../assets/settings.png';
import closeIcon from '../assets/close.png';
import {SettingsButton} from '../Components/SettingsButton';
import {SettingsProps} from '../types';
import {useTranslation} from 'react-i18next';
import KnowledgeBaseManager from './KnowledgeBaseManager';

/**
 * Settings component - Manages app settings including language, voice, frequency mode, and knowledge base.
 * @param {SettingsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const Settings: React.FC<SettingsProps> = ({
  voice,
  setVoice,
  isFrequencyCheckingMode,
  setIsFrequencyCheckingMode,
  knowledgeBase,
  setKnowledgeBase,
}: SettingsProps): JSX.Element => {
  const [modalVisible, setModalVisible] = useState(false);
  const [kbModalVisible, setKbModalVisible] = useState(false);
  const {t, i18n} = useTranslation();

  // Change language and update the state
  const changeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
  };

  // Handle settings change for language and voice
  const handleSettingsChange = (newLanguage: string, newVoice: string) => {
    changeLanguage(newLanguage);
    setVoice(newVoice);
  };

  // Handle frequency mode change
  const handleFrequencyModeChange = (isFrequencyCheckingMode: boolean) => {
    setIsFrequencyCheckingMode(isFrequencyCheckingMode);
  };

  const language = i18n?.language;

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          {/* Close Icon */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Image source={closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>
          <View style={styles.optionsContainer}>
            <Text style={styles.text}>{t('Select_language')}</Text>
            <View style={styles.selectionButtons}>
              {/* Buttons for language selection */}
              <SettingsButton
                text={t('English')}
                onPress={() => handleSettingsChange('en', voice)}
                style={
                  (language?.includes('en') && styles.selectedLanguage) || {}
                }
              />
              <SettingsButton
                text={t('German')}
                onPress={() => handleSettingsChange('de', voice)}
                style={
                  (language?.includes('de') && styles.selectedLanguage) || {}
                }
              />
            </View>
            <Text style={styles.text}>{t('Select_voice')}</Text>
            <View style={styles.selectionButtons}>
              {/* Buttons for voice selection */}
              <SettingsButton
                text={t('Male')}
                onPress={() => handleSettingsChange(language, 'male')}
                style={(voice === 'male' && styles.selectedLanguage) || {}}
              />
              <SettingsButton
                text={t('Female')}
                onPress={() => handleSettingsChange(language, 'female')}
                style={(voice === 'female' && styles.selectedLanguage) || {}}
              />
            </View>
            <Text style={styles.text}>{t('Edit_knowledge_base')}</Text>
            <SettingsButton
              text={t('Manage_knowledge_base')}
              onPress={() => setKbModalVisible(true)}
              style={{width: 250}}
            />
            <Text style={styles.text}>{t('Select_frequency_mode')}</Text>
            <View style={styles.selectionButtons}>
              {/* Buttons for frequency mode selection */}
              <SettingsButton
                text={t('On')}
                onPress={() => handleFrequencyModeChange(true)}
                style={
                  (isFrequencyCheckingMode && styles.selectedLanguage) || {}
                }
              />
              <SettingsButton
                text={t('Off')}
                onPress={() => handleFrequencyModeChange(false)}
                style={
                  (!isFrequencyCheckingMode && styles.selectedLanguage) || {}
                }
              />
            </View>
          </View>
        </View>
      </Modal>

      <KnowledgeBaseManager
        knowledgeBase={knowledgeBase}
        setKnowledgeBase={setKnowledgeBase}
        modalVisible={kbModalVisible}
        setModalVisible={setKbModalVisible}
      />

      {/* Settings Icon */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        hitSlop={{top: 20, bottom: 70, left: 50, right: 50}}>
        <Image
          source={settingsIcon}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

// Styles for the Settings component
const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  closeIcon: {
    width: 80,
    height: 80,
  },
  settingsIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 30,
    height: 30,
  },
  modalView: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    top: -20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 350,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    top: 10,
  },
  selectionButtons: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    position: 'relative',
    margin: 30,
    backgroundColor: '#FFFFFF',
  },
  text: {
    color: '#000000',
    fontFamily: 'Montserrat-Medium',
  },
  selectedLanguage: {
    backgroundColor: '#1246AC',
    color: '#FFFFFF',
  },
});
