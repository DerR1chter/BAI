import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {KnowledgeBase} from '../types';
import {
  loadKnowledgeBase,
  saveKnowledgeBase,
} from '../Helpers/KnowledgeBaseLoader';
import closeIcon from '../assets/close.png';
import {ServiceButton} from '../Components/ServiceButton';
import ConfirmationModal from './ModalConfirm';
import {useTranslation} from 'react-i18next';

interface KnowledgeBaseManagerProps {
  knowledgeBase: KnowledgeBase;
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeBase>>;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  knowledgeBase,
  setKnowledgeBase,
  modalVisible,
  setModalVisible,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [renameCategory, setRenameCategory] = useState<string>('');
  const [isRename, setIsRename] = useState(false);
  const [prevKnowledgeBase, setPrevKnowledgeBase] = useState<KnowledgeBase>({});
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const {t} = useTranslation();

  const handleAddItem = () => {
    if (newItem.trim() && selectedCategory) {
      setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
        const updatedCategory = [
          ...prevKnowledgeBase[selectedCategory],
          newItem.trim(),
        ];
        const updatedKnowledgeBase: KnowledgeBase = {
          ...prevKnowledgeBase,
          [selectedCategory]: updatedCategory,
        };
        return updatedKnowledgeBase;
      });
      setNewItem('');
    }
  };

  const handleRemoveItem = (item: string) => {
    if (selectedCategory) {
      setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
        const updatedCategory = prevKnowledgeBase[selectedCategory].filter(
          i => i !== item,
        );
        const updatedKnowledgeBase: KnowledgeBase = {
          ...prevKnowledgeBase,
          [selectedCategory]: updatedCategory,
        };
        return updatedKnowledgeBase;
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !knowledgeBase[newCategory.trim()]) {
      setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
        const updatedKnowledgeBase: KnowledgeBase = {
          ...prevKnowledgeBase,
          [newCategory.trim()]: [],
        };
        return updatedKnowledgeBase;
      });
      setNewCategory('');
    }
  };

  const handleRenameCategory = () => {
    if (selectedCategory && renameCategory.trim()) {
      setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
        const {[selectedCategory]: value, ...rest} = prevKnowledgeBase;
        const updatedKnowledgeBase: KnowledgeBase = {
          ...rest,
          [renameCategory.trim()]: value,
        };
        return updatedKnowledgeBase;
      });
      setSelectedCategory(renameCategory.trim());
      setRenameCategory('');
      setIsRename(false);
    }
  };

  const handleRemoveCategory = (category: string) => {
    setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
      const {[category]: _, ...rest} = prevKnowledgeBase;
      const updatedKnowledgeBase: KnowledgeBase = rest;
      return updatedKnowledgeBase;
    });
  };

  const handleSaveChanges = () => {
    saveKnowledgeBase(knowledgeBase);
    setPrevKnowledgeBase(knowledgeBase);
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCancelChanges = () => {
    setKnowledgeBase(prevKnowledgeBase);
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPrevKnowledgeBase(knowledgeBase);
  };

  const resetKnowledgeBase = async () => {
    const originalKnowledgeBase = await loadKnowledgeBase(true);
    setKnowledgeBase(originalKnowledgeBase);
    setPrevKnowledgeBase(originalKnowledgeBase);
    setModalVisible(false);
    setSelectedCategory(null);
    setConfirmResetVisible(false);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancelChanges}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('Knowledge_base_manager')}</Text>
            {!selectedCategory && !isRename && (
              <View>
                <FlatList
                  data={Object.keys(knowledgeBase)}
                  renderItem={({item}) => (
                    <View style={styles.categoryContainer}>
                      <TouchableOpacity
                        onPress={() => handleCategorySelect(item)}
                        style={styles.categoryTouchable}>
                        <Text style={styles.categoryText}>{item}</Text>
                      </TouchableOpacity>
                      <View style={styles.renameRemoveContainer}>
                        <ServiceButton
                          text={t('Rename')}
                          onPress={() => {
                            setSelectedCategory(item);
                            setIsRename(true);
                          }}
                          style={{width: 110}}
                        />
                        <ServiceButton
                          text={t('Remove')}
                          onPress={() => handleRemoveCategory(item)}
                          style={{width: 110}}
                        />
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.buttonsContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('Add_new_category')}
                    value={newCategory}
                    onChangeText={setNewCategory}
                  />
                  <ServiceButton
                    text={t('Add_category')}
                    onPress={handleAddCategory}
                  />
                </View>
                <TouchableOpacity onPress={() => setConfirmResetVisible(true)}>
                  <Text style={styles.resetButton}>
                    {t('Reset_the_knowledge_base')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {selectedCategory && !isRename && (
              <View>
                <ServiceButton
                  text={t('Go_back')}
                  onPress={() => setSelectedCategory(null)}
                  style={{backgroundColor: 'gray'}}
                />
                <Text style={styles.subtitle}>{selectedCategory}</Text>
                <FlatList
                  data={knowledgeBase[selectedCategory]}
                  renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item}</Text>
                      <ServiceButton
                        text={t('Remove')}
                        onPress={() => handleRemoveItem(item)}
                        style={{width: 120}}
                      />
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={[styles.buttonsContainer, {marginBottom: 0}]}>
                  <TextInput
                    style={styles.input}
                    placeholder={`${t(
                      'Add_new',
                    )} ${selectedCategory?.toLowerCase()}`}
                    value={newItem}
                    onChangeText={setNewItem}
                  />
                  <ServiceButton text={t('Add_item')} onPress={handleAddItem} />
                </View>
                <View style={styles.buttonsContainer}>
                  <ServiceButton text={t('Save')} onPress={handleSaveChanges} />
                  <ServiceButton
                    text={t('Cancel')}
                    onPress={handleCancelChanges}
                  />
                </View>
              </View>
            )}
            {isRename && (
              <View>
                <ServiceButton
                  text={t('Go_back')}
                  onPress={() => {
                    setIsRename(false);
                    setSelectedCategory(null);
                  }}
                />
                <Text style={styles.subtitle}>{t('Rename_category')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('New_category')}
                  value={renameCategory}
                  onChangeText={setRenameCategory}
                />
                <ServiceButton
                  text={t('Rename')}
                  onPress={handleRenameCategory}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      <ConfirmationModal
        visible={confirmResetVisible}
        onRequestClose={() => setConfirmResetVisible(false)}
        onConfirm={resetKnowledgeBase}
        onCancel={() => setConfirmResetVisible(false)}
        title={t('Confirm_reset')}
        message={t('Are_you_sure_you_want_to_reset')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 0,
  },
  closeIcon: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 22,
    marginTop: 15,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  categoryTouchable: {
    flex: 0.25,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    flexWrap: 'wrap',
    width: '100%', // Ensure the text takes the full width of the TouchableOpacity
  },
  renameRemoveContainer: {
    flex: 0.75,
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust this if needed
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
    justifyContent: 'space-between',
  },
  input: {
    width: '50%',
    height: 40,
    borderColor: '#7A82E2',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    color: '#7A82E2',
    borderRadius: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    flex: 0.75,
    flexWrap: 'wrap',
  },
  resetButton: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Montserrat-Medium',
    marginTop: -60,
    textAlign: 'center',
  },
});

export default KnowledgeBaseManager;
