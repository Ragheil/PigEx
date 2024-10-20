import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, Image, TextInput, Button } from 'react-native';
import { collection, onSnapshot, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/config2';
import styles from '../../frontend/componentsStyles/SeeAllBranchesStyles'; // Import styles
import editIcon from '../../assets/images/buttons/editIcon.png';
import deleteIcon from '../../assets/images/buttons/deleteIcon.png';

const SeeAllBranchesScreen = () => {
  const [branches, setBranches] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [newBranchData, setNewBranchData] = useState({ name: '', otherField: '' });

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const branchRef = collection(firestore, `users/${userId}/farmBranches`);

      // Listen for branch updates
      const unsubscribe = onSnapshot(branchRef, (snapshot) => {
        const branchList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBranches(branchList);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    Alert.alert('Branch Selected', `You selected ${branch.name}`);
  };

  // Open the edit modal
  const openEditModal = (branch) => {
    setSelectedBranch(branch);
    setNewBranchData({ name: branch.name, otherField: branch.otherField || '' });
    setModalVisible(true);
  };

  // Handle the editing of a branch
  const handleEdit = async () => {
    if (newBranchData.name.trim()) {
      try {
        const updatedBranchData = {
          name: newBranchData.name,
          otherField: newBranchData.otherField || '' // Ensure a value is sent to Firestore
        };

        await setDoc(
          doc(firestore, `users/${user.uid}/farmBranches/${selectedBranch.id}`),
          updatedBranchData,
          { merge: true } // Merge updates to avoid overwriting the whole document
        );

        Alert.alert('Success', 'Branch updated successfully!');
        setModalVisible(false);
      } catch (error) {
        console.error("Update Error: ", error);
        Alert.alert('Error', 'Could not update the branch.');
      }
    } else {
      Alert.alert('Error', 'Branch name cannot be empty.');
    }
  };

  // Handle branch deletion
  const handleDelete = async (branchId) => {
    try {
      await deleteDoc(doc(firestore, `users/${user.uid}/farmBranches/${branchId}`));
      Alert.alert('Success', 'Branch deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Could not delete the branch.');
    }
  };

  // Render each branch item
  const renderBranchItem = ({ item }) => (
    <View style={styles.branchItem}>
      <TouchableOpacity onPress={() => handleBranchSelect(item)}>
        <Text style={styles.branchName}>{item.name}</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Farm Branches</Text>
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id}
        renderItem={renderBranchItem}
        ListEmptyComponent={<Text>No branches available.</Text>}
      />

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
              value={newBranchData.name}
              onChangeText={(text) => setNewBranchData({ ...newBranchData, name: text })}
              placeholder="Enter new branch name"
            />
            <TextInput
              style={styles.input}
              value={newBranchData.otherField}
              onChangeText={(text) => setNewBranchData({ ...newBranchData, otherField: text })}
              placeholder="Other field (optional)"
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
