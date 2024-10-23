import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, Image, TextInput, Button } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc, setDoc, getDocs, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/config2';
import styles from '../../frontend/componentsStyles/SeeAllBranchesStyles'; // Import styles
import editIcon from '../../assets/images/buttons/editIcon.png';
import deleteIcon from '../../assets/images/buttons/deleteIcon.png';

const SeeAllBranchesScreen = () => {
  const [branches, setBranches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [newBranchName, setNewBranchName] = useState('');
  const [branchModalVisible, setBranchModalVisible] = useState(false);  // Fix: Set boolean type
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const branchRef = collection(firestore, `users/${userId}/farmBranches/Farm Branch/Branches`);

      // Listen for branch updates
      const unsubscribe = onSnapshot(branchRef, (snapshot) => {
        const branchList = snapshot.docs.map(doc => ({
          id: doc.id,
          branch: doc.id,  // Add branch property here
          ...doc.data(),
        }));
        setBranches(branchList);
        setIsLoading(false);  // Data loaded
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    if (!branch || !branch.farmName) {
      Alert.alert('Error', 'Branch data is incomplete.');
      return;
    }
    Alert.alert('Branch Selected', `You selected ${branch.farmName}`);
  };

  // Open the edit modal
  const openEditModal = (branch) => {
    if (!branch) {
      Alert.alert('Error', 'Branch data is missing.');
      return;
    }
    setSelectedBranch(branch);
    setNewBranchName(branch.farmName);
    setModalVisible(true);
  };

  // Handle the editing of a branch
  const handleEdit = async () => {
    if (!selectedBranch || !newBranchName.trim()) {
      Alert.alert('Error', 'Farm name cannot be empty or no branch selected.');
      return;
    }

    try {
      await setDoc(
        doc(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch.id}`),
        { farmName: newBranchName },
        { merge: true } // Merge updates to avoid overwriting the whole document
      );

      Alert.alert('Success', 'Branch updated successfully!');
      setModalVisible(false);
      setSelectedBranch(null); // Reset selected branch
    } catch (error) {
      console.error("Update Error: ", error);
      Alert.alert('Error', 'Could not update the branch.');
    }
  };

  // Handle branch deletion
  const handleDelete = async (branchId) => {
    try {
      await deleteDoc(doc(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${branchId}`));
      setBranches((prevBranches) => prevBranches.filter(branch => branch.id !== branchId)); // Remove from state
      Alert.alert('Success', 'Branch deleted successfully!');
    } catch (error) {
      console.error('Delete Error: ', error);
      Alert.alert('Error', 'Could not delete the branch.');
    }
  };

  // Render each branch item
  const renderBranchItem = ({ item }) => (
    <View style={styles.branchItem}>
      <TouchableOpacity onPress={() => handleBranchSelect(item)}>
        <Text style={styles.branchName}>{item.farmName}</Text>
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Image source={editIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Delete Branch',
            'Are you sure you want to delete this branch?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => handleDelete(item.id) },
            ],
          );
        }}>
          <Image source={deleteIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handle adding a new branch
  const handleAddBranch = async () => {
    if (!newBranchName.trim()) {
      Alert.alert('Validation Error', 'Farm name is required!');
      return;
    }

    try {
      if (user) {
        const branchesCollectionRef = collection(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches`);
        const branchSnapshot = await getDocs(branchesCollectionRef);

        // Check if a branch with this farmName already exists
        const branchExists = branchSnapshot.docs.some(doc => doc.data().farmName === newBranchName);
        if (branchExists) {
          Alert.alert('Branch Error', 'A branch with this farm name already exists!');
          return;
        }

        // Add a new branch with a unique ID but with the 'newBranchName' field
        await addDoc(branchesCollectionRef, { farmName: newBranchName });

        // Reset input and close modal
        setNewBranchName('');
        setBranchModalVisible(false);
        Alert.alert('Success', 'Branch added successfully!');
      }
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;  // Handle loading state
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Farm Branches</Text>
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        renderItem={renderBranchItem}
        ListEmptyComponent={<Text>No branches available.</Text>}
      />

      {/* Add Branch Button */}
      <Button title="Add Branch" onPress={() => setBranchModalVisible(true)} />

      {/* Add Branch Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={branchModalVisible}
        onRequestClose={() => setBranchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Branch</Text>
            <TextInput
              style={styles.input}
              value={newBranchName}
              onChangeText={setNewBranchName}
              placeholder="Enter farm name"
            />
            <Button title="Add" onPress={handleAddBranch} />
            <Button title="Cancel" onPress={() => setBranchModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Branch</Text>
            <TextInput
              style={styles.input}
              value={newBranchName}
              onChangeText={setNewBranchName}
              placeholder="Enter new farm name"
            />
            <Button title="Update" onPress={handleEdit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SeeAllBranchesScreen;
