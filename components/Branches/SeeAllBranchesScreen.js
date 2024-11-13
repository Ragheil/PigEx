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
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State for delete modal
  const [branchNameToDelete, setBranchNameToDelete] = useState(''); // State for branch name input

  const user = auth.currentUser ;

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const branchRef = collection(firestore, `users/${userId}/farmBranches/Farm Branch/Branches`);

      const unsubscribe = onSnapshot(branchRef, (snapshot) => {
        const branchList = snapshot.docs.map(doc => ({
          id: doc.id,
          branch: doc.id,
          ...doc.data(),
        }));
        setBranches(branchList);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleBranchSelect = (branch) => {
    if (!branch || !branch.farmName) {
      Alert.alert('Error', 'Branch data is incomplete.');
      return;
    }
    Alert.alert('Branch Selected', `You selected ${branch.farmName}`);
  };

  const openEditModal = (branch) => {
    if (!branch) {
      Alert.alert('Error', 'Branch data is missing.');
      return;
    }
    setSelectedBranch(branch);
    setNewBranchName(branch.farmName);
    setModalVisible(true);
  };

  const handleEdit = async () => {
    if (!selectedBranch || !newBranchName.trim()) {
      Alert.alert('Error', 'Farm name cannot be empty or no branch selected.');
      return;
    }

    try {
      await setDoc(
        doc(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch.id}`),
        { farmName: newBranchName },
        { merge: true }
      );

      Alert.alert('Success', 'Branch updated successfully!');
      setModalVisible(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error("Update Error: ", error);
      Alert.alert('Error', 'Could not update the branch.');
    }
  };

  const openDeleteModal = (branch) => {
    setSelectedBranch(branch);
    setBranchNameToDelete(branch.farmName); // Set the branch name to delete
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (branchNameToDelete.trim() !== selectedBranch.farmName) {
      Alert.alert('Error', 'Branch name does not match. Please type the exact name to delete.');
      return;
    }

    try {
      await deleteDoc(doc(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch.id}`));
      setBranches((prevBranches) => prevBranches.filter(branch => branch.id !== selectedBranch.id));
      Alert.alert('Success', 'Branch deleted successfully!');
      setDeleteModalVisible(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Delete Error: ', error);
      Alert.alert('Error', 'Could not delete the branch.');
    }
  };

  const renderBranchItem = ({ item }) => (
    <View style={styles.branchItem}>
      <TouchableOpacity onPress={() => handleBranchSelect(item)}>
        <Text style={styles.branchName}>{item.farmName}</Text>
      </TouchableOpacity>
      <View style={ styles.iconContainer}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Image source={editIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openDeleteModal(item)}>
          <Image source={deleteIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddBranch = async () => {
    if (!newBranchName.trim()) {
      Alert.alert('Validation Error', 'Farm name is required!');
      return;
    }

    try {
      if (user) {
        const branchesCollectionRef = collection(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches`);
        const branchSnapshot = await getDocs(branchesCollectionRef);

        const branchExists = branchSnapshot.docs.some(doc => doc.data().farmName === newBranchName);
        if (branchExists) {
          Alert.alert('Branch Error', 'A branch with this farm name already exists!');
          return;
        }

        await addDoc(branchesCollectionRef, { farmName: newBranchName });

        setNewBranchName('');
        setBranchModalVisible(false);
        Alert.alert('Success', 'Branch added successfully!');
      }
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
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

      <Button title="Add Branch" onPress={() => setBranchModalVisible(true)} />

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
      <Modal
  animationType="slide"
  transparent={true}
  visible={deleteModalVisible}
  onRequestClose={() => setDeleteModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalView}>
      <Text style={styles.modalTitle}>Delete Branch</Text>
      <Text>
        Do you want to delete this branch? Type  <Text style={{ marginTop: 10, color: 'red',fontWeight: 'bold', }}>
        "{selectedBranch?.farmName}"
      </Text> to perform this action.
      </Text>
      <Text style={{ marginTop: 10, color: 'red' }}>
        Note: After deletion, you won't be able to recover this branch it anymore.
      </Text>
      <TextInput
        style={styles.input}
       // value={branchNameToDelete}
       // onChangeText={setBranchNameToDelete}       
       // placeholder={`Type "${selectedBranch?.farmName}"`}
      />
      <Button title="Delete" onPress={handleDelete} />
      <Button title="Cancel" onPress={() => setDeleteModalVisible(false)} color="red" />
    </View>
  </View>
</Modal>

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