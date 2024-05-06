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

export const Settings: React.FC<SettingsProps> = ({voice, setVoice}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSettingsChange = (newLanguage: string, newVoice: string) => {
    changeLanguage(newLanguage);
    setVoice(newVoice);
    setModalVisible(false);
  };

  const {t, i18n} = useTranslation();

  const changeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
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
                text="English"
                onPress={() => handleSettingsChange('en', voice)}
                style={
                  (language?.includes('en') && styles.selectedLanguage) || {}
                }
              />
              <SettingsButton
                text="German"
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
                text="Male"
                onPress={() => handleSettingsChange(language, 'male')}
                style={(voice === 'male' && styles.selectedLanguage) || {}}
              />
              <SettingsButton
                text="Female"
                onPress={() => handleSettingsChange(language, 'female')}
                style={(voice === 'female' && styles.selectedLanguage) || {}}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Icon */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {/* Settings icon image */}
        <Image
          source={settingsIcon}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    // Style for close button container if needed
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 0, // Makes it easier to press
  },
  closeIcon: {
    width: 80, // Adjust size as needed
    height: 80, // Adjust size as needed
  },
  settingsIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 30,
    height: 30,
  },
  modalView: {
    // Styles for modal view...
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
    height: 200,
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
    backgroundColor: '#3A2BB5',
    color: '#FFFFFF',
  },
});
