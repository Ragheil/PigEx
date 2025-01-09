import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Modal,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firestore } from '../../firebase/config2';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  onSnapshot,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import styles from '../../frontend/medicalStyles/MedicalRecordScreenStyles';
import backImage from '../../assets/images/buttons/backbutton.png'; // Adjust the path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
    
const MedicalRecordScreen = ({ route, navigation }) => {
  const { userId, selectedBranch, pigGroupId, pigName, selectedPigId } = route.params;
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [editRecordId, setEditRecordId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Medical Records

useEffect(() => {
  const fetchRecords = async () => {
    const recordsPath = selectedBranch === 'Main Farm'
      ? `users/${userId}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords`
      : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords`;
      
    const q = query(collection(firestore, recordsPath));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort records by date in descending order
      recordsList.sort((a, b) => {
        const dateA = a.date ? a.date.toDate() : new Date(0); // Fallback to epoch if date is not available
        const dateB = b.date ? b.date.toDate() : new Date(0); // Fallback to epoch if date is not available
        return dateB - dateA; // Sort in descending order
      });

      setRecords(recordsList);
      setFilteredRecords(recordsList); // Initialize filtered records
    });

    return () => unsubscribe();
  };

  fetchRecords();
}, [userId, selectedBranch, pigGroupId, selectedPigId]);
  // Filter records based on search query
  useEffect(() => {
    const filtered = records.filter(record =>
      record.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [searchQuery, records]);

  // Function to add new medical record
  const handleAddRecord = async () => {
    if (!name.trim() || !remarks.trim()) {
      Alert.alert('Validation Error', 'All fields must be filled.');
      return;
    }
  
    const recordsPath = selectedBranch === 'Main Farm'
      ? `users/${userId}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords`
      : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords`;
  
    try {
      await addDoc(collection(firestore, recordsPath), {
        name,
        date,
        remarks,
        createdAt: new Date(),
      });
      resetFields();
      setModalVisible(false);
      // Show alert when a record is added
      Alert.alert('Success', 'Medical record added successfully!');
    } catch (error) {
      console.error('Error adding record:', error);
      Alert.alert('Error', 'There was a problem adding the record.');
    }
  };

  // Function to edit an existing medical record
  const handleEditRecord = async (recordId) => {
    if (!name.trim() || !remarks.trim()) {
      Alert.alert('Validation Error', 'All fields must be filled.');
      return;
    }
  
    const recordsPath = selectedBranch === 'Main Farm'
      ? `users/${userId}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords/${recordId}`
      : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords/${recordId}`;
  
    try {
      await updateDoc(doc(firestore, recordsPath), {
        name,
        date,
        remarks,
      });
      resetFields();
      setEditRecordId(null);
      setModalVisible(false);
      Alert.alert('Success', 'Medical record updated successfully!'); // Success alert
    } catch (error) {
      console.error('Error updating record:', error);
      Alert.alert('Error', 'There was a problem updating the record.');
    }
  };

  // Function to delete a medical record with confirmation
  const handleDeleteRecord = async (recordId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this medical record?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            const recordsPath = selectedBranch === 'Main Farm'
              ? `users/${userId}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords/${recordId}`
              : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${selectedPigId}/medicalRecords/${recordId}`;
            try {
              await deleteDoc(doc(firestore, recordsPath));
              Alert.alert('Success', 'Medical record deleted successfully!'); // Success alert
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert('Error', 'There was a problem deleting the record.');
            }
          }
        }
      ]
    );
  };

  const resetFields = () => {
    setName('');
    setDate(new Date());
    setRemarks('');
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setIsDatePickerVisible(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Medical Records for {pigName}</Text> */}
      <SafeAreaView style={styles.mainheader}>
        <View style={{flexDirection: 'row', marginVertical: 8, gap: 5}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navibackButton}>
            <Image source={backImage} style={styles.backImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Medical Records</Text>
        </View>
        <View style={styles.searchContainer}>
          <Image 
                source={require('../../assets/images/search.png')}
                style={styles.iconsearch}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SafeAreaView>

      <View style={styles.groupnameContainer}>
        <Text style={[styles.groupname, styles.groupNametext]}>Medical Records:</Text>
        <Text style={[styles.groupname, styles.groupNamevalue]}>{pigName}</Text>
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text>Name: {item.name}</Text>
            <Text>Date: {item.date ? item.date.toDate().toLocaleDateString() : "Date not available"}</Text>
            <Text>Remarks: {item.remarks}</Text>
            <Button
              title="Edit"
              onPress={() => {
                setName(item.name);
                setDate(item.date ? item.date.toDate() : new Date());
                setRemarks(item.remarks);
                setEditRecordId(item.id);
                setModalVisible(true);
              }}
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteRecord(item.id)}
              color="red"
            />
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{editRecordId ? 'Edit Record' : 'Add Record'}</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Remarks"
            value={remarks}
            onChangeText={setRemarks}
            style={styles.input}
          />
          <Button title="Show Date Picker" onPress={() => setIsDatePickerVisible(true)} />
          {isDatePickerVisible && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <Button title={editRecordId ? 'Update Record' : 'Add Record'} onPress={() => {
            if (editRecordId) {
              handleEditRecord(editRecordId);
            } else {
              handleAddRecord();
            }
          }} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            resetFields();
            setModalVisible(true);
            setEditRecordId(null); // Ensure no record is set for editing
          }}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Medical Record</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default MedicalRecordScreen;