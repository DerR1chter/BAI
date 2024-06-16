import React, {useEffect, useState} from 'react';
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
import {KnowledgeBase, KnowledgeBaseManagerProps} from '../types';
import {
  loadKnowledgeBase,
  saveKnowledgeBase,
} from '../Helpers/KnowledgeBaseLoader';
import closeIcon from '../assets/close.png';
import deleteIcon from '../assets/delete.png';
import renameIcon from '../assets/rename.png';
import backIcon from '../assets/back.png';
import saveIcon from '../assets/save.png';
import cancelIcon from '../assets/cancel.png';
import {SettingsButton} from '../Components/SettingsButton';
import ConfirmationModal from './ModalConfirm';
import {useTranslation} from 'react-i18next';

/**
 * KnowledgeBaseManager component - Manages the knowledge base.
 * Allows adding, renaming, and removing categories and items within the knowledge base.
 * @param {KnowledgeBaseManagerProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  knowledgeBase,
  setKnowledgeBase,
  modalVisible,
  setModalVisible,
}: KnowledgeBaseManagerProps): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [isRename, setIsRename] = useState(false);
  const [prevKnowledgeBase, setPrevKnowledgeBase] =
    useState<KnowledgeBase>(knowledgeBase);
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);
  const {t} = useTranslation();

  // Save the previous knowledge base state when the modal is opened
  useEffect(() => {
    if (modalVisible) {
      setPrevKnowledgeBase(knowledgeBase);
    }
  }, [modalVisible, knowledgeBase]);

  // Handle adding a new item to the selected category
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

  // Handle removing an item from the selected category
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

  // Handle adding a new category to the knowledge base
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

  // Handle renaming a category in the knowledge base
  const handleRenameCategory = (oldName: string, newName: string) => {
    if (oldName && newName.trim()) {
      setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
        const {[oldName]: value, ...rest} = prevKnowledgeBase;
        const updatedKnowledgeBase: KnowledgeBase = {
          ...rest,
          [newName.trim()]: value,
        };
        return updatedKnowledgeBase;
      });
    }
  };

  // Handle removing a category from the knowledge base
  const handleRemoveCategory = (category: string) => {
    setKnowledgeBase((prevKnowledgeBase: KnowledgeBase): KnowledgeBase => {
      const {[category]: _, ...rest} = prevKnowledgeBase;
      const updatedKnowledgeBase: KnowledgeBase = rest;
      return updatedKnowledgeBase;
    });
  };

  // Handle saving changes to the knowledge base
  const handleSaveChanges = () => {
    saveKnowledgeBase(knowledgeBase);
    setPrevKnowledgeBase(knowledgeBase);
    setModalVisible(false);
    setSelectedCategory(null);
  };

  // Handle canceling changes and reverting to the previous knowledge base state
  const handleCancelChanges = () => {
    setKnowledgeBase(prevKnowledgeBase);
    setModalVisible(false);
    setSelectedCategory(null);
    setRenamingCategory(null);
  };

  // Handle selecting a category to view its items
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPrevKnowledgeBase(knowledgeBase);
  };

  // Reset the knowledge base to its original state
  const resetKnowledgeBase = async () => {
    const originalKnowledgeBase = await loadKnowledgeBase(true);
    setKnowledgeBase(originalKnowledgeBase);
    setPrevKnowledgeBase(originalKnowledgeBase);
    setModalVisible(false);
    setSelectedCategory(null);
    setConfirmResetVisible(false);
  };

  const [renamingCategory, setRenamingCategory] = useState<string | null>(null);
  const [renamedCategory, setRenamedCategory] = useState<string>('');

  // Render a category in the FlatList
  const renderCategory = ({item}: {item: string}) => (
    <View style={styles.categoryContainer}>
      {renamingCategory === item ? (
        <TextInput
          style={styles.input}
          value={renamedCategory}
          onChangeText={setRenamedCategory}
        />
      ) : (
        <TouchableOpacity
          onPress={() => handleCategorySelect(item)}
          style={styles.categoryTouchable}>
          <Text style={styles.categoryText}>{item}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.iconContainer}>
        {renamingCategory === item ? (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                handleRenameCategory(item, renamedCategory);
                setRenamingCategory(null);
              }}>
              <Image source={saveIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setRenamingCategory(null)}>
              <Image source={cancelIcon} style={styles.icon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                setRenamingCategory(item);
                setRenamedCategory(item);
              }}>
              <Image source={renameIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleRemoveCategory(item)}>
              <Image source={deleteIcon} style={styles.icon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

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
              onPress={handleCancelChanges}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>{t('Knowledge_base_manager')}</Text>
            {!selectedCategory && !isRename && (
              <View>
                <FlatList
                  data={Object.keys(knowledgeBase)}
                  renderItem={renderCategory}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.buttonsContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('Add_new_category')}
                    value={newCategory}
                    onChangeText={setNewCategory}
                  />
                  <SettingsButton
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
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setSelectedCategory(null)}>
                  <Image source={backIcon} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.subtitle}>{selectedCategory}</Text>
                <FlatList
                  data={knowledgeBase[selectedCategory]}
                  renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemText}>{item}</Text>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleRemoveItem(item)}>
                        <Image source={deleteIcon} style={styles.icon} />
                      </TouchableOpacity>
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
                  <SettingsButton
                    text={t('Add_item')}
                    onPress={handleAddItem}
                  />
                </View>
                <View style={styles.buttonsContainer}>
                  <SettingsButton
                    text={t('Save')}
                    onPress={handleSaveChanges}
                  />
                  <SettingsButton
                    text={t('Cancel')}
                    onPress={handleCancelChanges}
                  />
                </View>
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

// Styles for the KnowledgeBaseManager component
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
    zIndex: 10,
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
    flex: 1,
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
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
  },
  icon: {
    width: 30,
    height: 30,
    position: 'relative',
  },
});

export default KnowledgeBaseManager;
