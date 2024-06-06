// KeywordArea.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Text, Switch, TextInput} from 'react-native';
import {FrequencyAreaProps} from '../types';
import {Frequency} from './Frequency';
import {ColorPicker} from 'react-native-color-picker';
import {useTranslation} from 'react-i18next';

export const FrequencyArea: React.FC<FrequencyAreaProps> = ({
  frequencyModeBackgroundColor,
  setFrequencyModeBackgroundColor,
}) => {
  const [isColorSelectingMode, setIsColorSelectingMode] = useState(false);
  const [isCardsColorSelectingMode, setIsCardsColorSelectingMode] =
    useState(false);
  const [cardsBackgroundColor, setCardsBackgroundColor] = useState('#FFFFFF');
  const [frequencies, setFrequencies] = useState([10, 12, 15, 20, 30, 60]);
  const [frequencyInput, setFrequencyInput] = useState('');
  const [isFrequencySpecifyingMode, setIsFrequencySpecifyingMode] =
    useState(false);

  const toggleFrequencySpecifyingMode = (newValue: boolean) => {
    setIsFrequencySpecifyingMode(newValue);
    setIsCardsColorSelectingMode(false);
    setIsColorSelectingMode(false);
    if (newValue) {
      // Populate the input field with current frequencies when enabling the mode
      setFrequencyInput(frequencies.join(', '));
    } else {
      // Submit the new frequencies when disabling the mode
      submitFrequencies();
    }
  };

  const submitFrequencies = () => {
    const newFrequencies = frequencyInput
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num));
    setFrequencies(newFrequencies);
  };

  const {t} = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: frequencyModeBackgroundColor},
      ]}>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{t('Background_color_mode')}</Text>
        <Switch
          trackColor={{false: '#FFFFFF', true: '#FFFFFF'}}
          thumbColor={'#7A82E2'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={newValue => {
            setIsColorSelectingMode(newValue);
            setIsCardsColorSelectingMode(false);
            setIsFrequencySpecifyingMode(false);
          }}
          value={isColorSelectingMode}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{t('Cards_color_mode')}</Text>
        <Switch
          trackColor={{false: '#FFFFFF', true: '#FFFFFF'}}
          thumbColor={'#7A82E2'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={newValue => {
            setIsCardsColorSelectingMode(newValue);
            setIsColorSelectingMode(false);
            setIsFrequencySpecifyingMode(false);
          }}
          value={isCardsColorSelectingMode}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{t('Frequency_specifying_mode')}</Text>
        <Switch
          trackColor={{false: '#FFFFFF', true: '#FFFFFF'}}
          thumbColor={'#7A82E2'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleFrequencySpecifyingMode}
          value={isFrequencySpecifyingMode}
        />
      </View>
      {isColorSelectingMode || isCardsColorSelectingMode ? (
        <View style={styles.colorPickerContainer}>
          <ColorPicker
            onColorSelected={color =>
              isColorSelectingMode
                ? setFrequencyModeBackgroundColor(color)
                : setCardsBackgroundColor(color)
            }
            style={styles.colorPicker}
          />
        </View>
      ) : isFrequencySpecifyingMode ? (
        <TextInput
          style={styles.input}
          onChangeText={setFrequencyInput}
          value={frequencyInput}
          placeholder="Enter frequencies separated by commas"
          keyboardType="numeric"
          onSubmitEditing={submitFrequencies}
        />
      ) : (
        <View style={styles.keywordArea}>
          <View style={styles.grid}>
            {frequencies.map((frequency, index) => (
              <View key={index} style={styles.card}>
                <Frequency
                  frequency={frequencies[index]}
                  style={{backgroundColor: cardsBackgroundColor}}
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keywordArea: {
    margin: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  card: {
    // flexBasis: '48%', // Slightly less than half the container width to fit two items per row
    marginBottom: 10, // Spacing between the rows
  },
  text: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  serviceRow: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPicker: {
    flex: 1,
    height: 300,
    width: 300,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 10,
    color: '#FFFFFF',
  },
  colorPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
});
