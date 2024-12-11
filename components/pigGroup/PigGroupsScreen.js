import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView, Image, RefreshControl  } from 'react-native';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, where, getDoc,onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config2';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import pigImage from '../../assets/images/pigIcon.png';
import editIcon from '../../assets/images/buttons/editIcon.png';
import deleteIcon from '../../assets/images/buttons/deleteIcon.png';
import styles from '../../frontend/pigGroupStyles/PigGroupsScreenStyles';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backImage from '../../assets/images/buttons/backbutton.png'; // Adjust the path as needed
import { SafeAreaView } from 'react-native-safe-area-context';


const PigGroupsScreen = ({ navigation, route }) => {
 // const { selectedBranch } = route.params;
  const user = auth.currentUser;
  const [pigGroups, setPigGroups] = useState([]);
  const [filteredPigGroups, setFilteredPigGroups] = useState([]);
  const [name, setName] = useState('');
  const [editPigGroupId, setEditPigGroupId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPigGroupName, setCurrentPigGroupName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const { selectedBranch, farmName: initialFarmName } = route.params; // Destructure farmName as initialFarmName
  const [farmName, setFarmName] = useState(initialFarmName); // Rename the
  const [refreshing, setRefreshing] = useState(false); // New state for refreshing
  const [offlineDeletions, setOfflineDeletions] = useState([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = fetchPigGroups();
      return () => unsubscribe();
    }
  }, [user, selectedBranch]);

  useEffect(() => {
    const results = pigGroups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPigGroups(results);
  }, [searchQuery, pigGroups]);

  // Function to check if the selected branch exists before allowing pig group operations
  const branchExists = async () => {
    try {
        const branchRef = selectedBranch === 'Main Farm' 
            ? doc(firestore, `users/${user.uid}/farmBranches/Main Farm`) 
            : doc(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}`); // Adjusted for nested structure

        const branchSnapshot = await getDoc(branchRef);
        return branchSnapshot.exists();  // Returns true if the branch exists
    } catch (error) {
        console.error('Error checking branch existence:', error);
        return false;
    }
};

const onRefresh = () => {
  setRefreshing(true);
  fetchPigGroups();
};


const fetchPigGroups = () => {
  if (!user || !farmName) return () => {}; 

  const pigGroupsCollectionPath = selectedBranch === 'Main Farm'
    ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
    : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

  const pigGroupsCollection = collection(firestore, pigGroupsCollectionPath);
  const q = query(pigGroupsCollection, orderBy('name'));

  return onSnapshot(q, async (snapshot) => {
    const pigGroupPromises = snapshot.docs.map(async (doc) => {
      const pigGroupId = doc.id;

      const pigsCollectionPath = `${pigGroupsCollectionPath}/${pigGroupId}/pigs`;
      const pigsCollection = collection(firestore, pigsCollectionPath);
      const pigsSnapshot = await getDocs(pigsCollection); // Get pigs snapshot directly

      // Count only the pigs that are alive and not sold
      const alivePigsCount = pigsSnapshot.docs.filter(pigDoc => 
        pigDoc.data().vitality !== 'deceased' && !pigDoc.data().sold
      ).length;

      return {
        id: pigGroupId,
        ...doc.data(),
        pigCount: alivePigsCount, // Use the count of alive pigs that are not sold
      };
    });

    Promise.all(pigGroupPromises).then((pigGroupsList) => {
      setPigGroups(pigGroupsList);
      setRefreshing(false); // Stop refreshing after fetching data
    });
  });
};
  


  
  

  const isPigGroupNameDuplicate = async (name) => {
    if (!user) return false;

    try {
      const pigGroupsCollection = collection(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`);
      const q = query(pigGroupsCollection, where('name', '==', name));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking pig group name:', error);
      return false;
    }
  };

  const addOrUpdatePigGroup = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required!');
      return;
    }

    if (selectedBranch !== 'Main Farm' && !(await branchExists())) {
      Alert.alert('Validation Error', `Branch ${selectedBranch} does not exist. Please select a valid branch.`);
      return;
    }

    const isDuplicate = await isPigGroupNameDuplicate(name);
    if (isDuplicate) {
      Alert.alert('Validation Error', 'A pig group with this name already exists.');
      return;
    }

    try {
      if (!user) return;

      const pigGroupsCollection = selectedBranch === 'Main Farm'
        ? collection(firestore, `users/${user.uid}/farmBranches/Main Farm/pigGroups`)
        : collection(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`);

      if (editPigGroupId) {
        // Update existing pig group
        await updateDoc(doc(pigGroupsCollection, editPigGroupId), { name });
        console.log('Pig group updated:', name);
      } else {
        // Add new pig group
        await addDoc(pigGroupsCollection, { name });
        console.log('Pig group added:', name);
      }

      setName('');
      setEditPigGroupId(null);
      setIsAddEditModalVisible(false);
    } catch (error) {
      console.error('Error adding/updating pig group:', error);
    }
  };

  const confirmDeletePigGroup = (pigGroup) => {
    setCurrentPigGroupName(pigGroup.name);
    setEditPigGroupId(pigGroup.id);
    setIsDeleteModalVisible(true);
  };

 // Function to delete a pig group
 const deletePigGroup = async () => {
  if (deleteConfirmation !== currentPigGroupName) {
    Alert.alert('Validation Error', 'Pig group name does not match.');
    return;
  }

  try {
    if (!user) return;

    const pigGroupsCollectionPath = selectedBranch === 'Main Farm'
      ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
      : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

    const docRef = doc(firestore, pigGroupsCollectionPath, editPigGroupId);

    // Check network connectivity
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      // Online: Delete immediately
      await deleteSubcollections(docRef);
      await deleteDoc(docRef);
      console.log('Pig group deleted:', currentPigGroupName);
      // Update state to remove the deleted pig group
      setPigGroups(prev => prev.filter(group => group.id !== editPigGroupId));
      Alert.alert('Success', `The pig group "${currentPigGroupName}" has been deleted.`);
    } else {
      // Offline: Queue deletion
      const newOfflineDeletions = [...offlineDeletions, { id: editPigGroupId, name: currentPigGroupName }];
      setOfflineDeletions(newOfflineDeletions);
      await AsyncStorage.setItem('offlineDeletions', JSON.stringify(newOfflineDeletions));
      console.log('Pig group deletion queued for offline:', currentPigGroupName);
      // Update state to reflect the deletion in the UI
      setPigGroups(prev => prev.filter(group => group.id !== editPigGroupId));
      Alert.alert('Success', `The pig group "${currentPigGroupName}" has been queued for deletion.`);
    }

    setIsDeleteModalVisible(false);
    setDeleteConfirmation('');
  } catch (error) {
    console.error('Error deleting pig group:', error);
    Alert.alert('Error', 'Failed to delete pig group. Please try again.');
  }
};

  const processOfflineDeletions = async () => {
    const storedDeletions = await AsyncStorage.getItem('offlineDeletions');
    if (storedDeletions) {
      const deletions = JSON.parse(storedDeletions);
      for (const deletion of deletions) {
        const pigGroupsCollectionPath = selectedBranch === 'Main Farm'
          ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
          : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;
  
        const docRef = doc(firestore, pigGroupsCollectionPath, deletion.id);
        await deleteSubcollections(docRef);
        await deleteDoc(docRef);
        console.log('Processed offline deletion:', deletion.name);
      }
      // Clear offline deletions after processing
      await AsyncStorage.removeItem('offlineDeletions');
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        processOfflineDeletions(); // Process deletions when back online
      }
    });
    return () => unsubscribe();
  }, []);
  // Function to delete all subcollections of a document
  const deleteSubcollections = async (docRef) => {
    const subcollections = await getDocs(collection(docRef, 'pigs')); // Adjust the subcollection name as needed
    const deletePromises = subcollections.docs.map(subDoc => deleteDoc(subDoc.ref));
    await Promise.all(deletePromises);
    console.log('All subcollections deleted for:', docRef.path);
  };

  const startEditPigGroup = (pigGroup) => {
    setName(pigGroup.name);
    setEditPigGroupId(pigGroup.id);
    setIsAddEditModalVisible(true);
  };

  const openAddPigGroupModal = () => {
    setName('');
    setEditPigGroupId(null);
    setIsAddEditModalVisible(true);
  };

  const closeModal = () => {
    setIsAddEditModalVisible(false);
    setIsDeleteModalVisible(false);
  };
  const handlePigGroupClick = (pigGroup) => {
    navigation.navigate('AddPigInfoScreen', { pigGroupId: pigGroup.id, selectedBranch });
  };
  

  const renderPigGroups = () => {
    return (
      <View style={styles.grid}>
        {filteredPigGroups.map(pigGroup => (

          <TouchableOpacity
            key={pigGroup.id}
            onPress={() => handlePigGroupClick(pigGroup)}
            style={styles.pigGroupItem}
          >
            <Image source={require('../../assets/images/pigIcon.png')} style={styles.pigIcon} />
            <Text style={styles.pigGroupText}>{pigGroup.name}</Text>
              {/* Display Pig Count Below the Name */}
          <Text style={styles.pigCountText}>Pigs: {pigGroup.pigCount}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => startEditPigGroup(pigGroup)}>
                <Image source={editIcon} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDeletePigGroup(pigGroup)}>
                <Image source={deleteIcon} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  useEffect(() => {
    const fetchFarmName = async () => {
        try {
            const branchRef = doc(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}`);
            const branchSnapshot = await getDoc(branchRef);
            if (branchSnapshot.exists()) {
                const data = branchSnapshot.data();
                // Assuming your document has a field named 'farmName'
                setFarmName(data.farmName); // Adjust based on your Firestore document structure
            } else {
                console.log('Branch document does not exist');
            }
        } catch (error) {
            console.error('Error fetching farm name:', error);
        }
    };

    if (selectedBranch) {
        fetchFarmName();
    }
}, [selectedBranch, user.uid]); // Fetch when selectedBranch or user ID changes

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.mainheader}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navibackButton}>
            <Image source={backImage} style={styles.backImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Pig Groups</Text>
        </View>
        <View style={styles.searchAndAddContainer}>
          <Image 
                source={require('../../assets/images/search.png')}
                style={styles.iconsearch}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SafeAreaView>
    <View style={styles.body}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderPigGroups()}
        
      </ScrollView>
      {/* Modal for adding or editing pig group */}
      <Modal isVisible={isAddEditModalVisible} onBackdropPress={closeModal}>
        <Text style={styles.modalTitle}>{editPigGroupId ? 'Edit Pig Group' : 'Add Pig Group'}</Text>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter Pig Group Name"
              value={name}
              onChangeText={setName}
            />
            <View style={{flexDirection: 'row', columnGap: 10}}>
              <View style={{flex: 1}}>
                <Button title="Save" onPress={addOrUpdatePigGroup} color="#399918" />
              </View>
              <View style={{flex: 1}}>
                <Button title="Cancel" onPress={closeModal} color="#B7B7B7" />    
              </View>
            </View>
          </View>
      </Modal>

      {/* Modal for confirming deletion */}
      <Modal isVisible={isDeleteModalVisible} onBackdropPress={closeModal}>
      <Text style={styles.modalTitle}>Confirm Deletion</Text>
        <View style={styles.modalContent}>
          <Text>
            <Text style={styles.boldText}>Warning:</Text> Deleting this group will remove all pig information within it. Are you sure you want to delete this group? Type "<Text style={styles.boldText}>{currentPigGroupName}</Text>" to confirm:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Pig Group Name"
            value={deleteConfirmation}
            onChangeText={setDeleteConfirmation}
          />
          <View style={{flexDirection: 'row', columnGap: 10}}>
            <View style={{flex: 1}}>
              <Button title="Cancel" onPress={closeModal} color="#B7B7B7" />
            </View>
            <View style={{flex: 1}}>
              <Button title="Delete" onPress={deletePigGroup} color="#F44336" />  
            </View>
          </View>
        </View>
      </Modal>
    </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={openAddPigGroupModal}
        style={styles.addButton}
      >
        <Text style={styles.buttonText}>Add Pig Group</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default PigGroupsScreen;