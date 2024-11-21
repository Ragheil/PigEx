import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, Modal, TouchableOpacity, Image, Switch  } from 'react-native';
import { addDoc, collection, query, onSnapshot, doc, getDoc, updateDoc, deleteDoc, getDocs, where, writeBatch } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config2';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import deleteIcon from '../../assets/images/buttons/deleteIcon.png';
import editIcon from '../../assets/images/buttons/editIcon.png';
import viewIcon from '../../assets/images/buttons/viewIcon.png';
import styles from '../../frontend/pigGroupStyles/AddPigInfoScreenStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect
import NetInfo from '@react-native-community/netinfo'; // Make sure to import NetInfo
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


export default function AddPigInfoScreen({ route }) {
  const navigation = useNavigation(); // Get the navigation object
  const { pigGroupId, selectedBranch } = route.params; // Add selectedBranch param
  const [pigName, setPigName] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [gender, setGender] = useState('male');
  const [race, setRace] = useState('');
  const [pigs, setPigs] = useState([]);
  const [currentPigId, setCurrentPigId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pigGroupName, setPigGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPig, setSelectedPig] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());  // Date of birth state
  const [openDatePicker, setOpenDatePicker] = useState(false); // Corrected
  const [vitality, setVitality] = useState('alive'); // Vitality state (alive/disabled)
  const [isVitalityEditable, setIsVitalityEditable] = useState(false); // Controls the picker state
  const [date, setDate] = useState(new Date());
  const datePickerRef = useRef(null);
  const handleOpenDeathDatePicker = () => setOpenDeathDatePicker(true);
  const [isDeceased, setIsDeceased] = useState(false); // Toggle for deceased status
  const [causeOfDeath, setCauseOfDeath] = useState('');  // Cause of death state
  const [openDeathDatePicker, setOpenDeathDatePicker] = useState(false); // Control for death date picker
  const [dateOfDeath, setDateOfDeath] = useState(new Date());  // Date of death state
  const [femalePigs, setFemalePigs] = useState([]); // Add state for female pigs
  const [selectedFemalePigId, setSelectedFemalePigId] = useState(null); // Track selected female pig
  const [selectedFemalePig, setSelectedFemalePig] = useState(null);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [motherName, setMotherName] = useState("");
  const [selectedPiglets, setSelectedPiglets] = useState([]); // Add this line to your state initialization
  
  
  const handleOpenDatePicker = () => {
    setOpenDatePicker(true);
  };
  // Fetch Pig Group Name based on selected branch
  const fetchPigGroupName = async () => {
    const pigCollectionPath = selectedBranch === 'Main Farm'
      ? `users/${user.uid}/farmBranches/Main Farm/pigGroups/${pigGroupId}`
      : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}`;
      
    const docRef = doc(firestore, pigCollectionPath);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      setPigGroupName(docSnapshot.data().name);
    }
  };

  useEffect(() => {
    fetchPigGroupName();
  }, [pigGroupId, user.uid]);

  const fetchFemalePigs = async () => {
    setLoading(true);
    try {
      // Determine the branch path based on selectedBranch
      const isMainFarm = selectedBranch === 'Main Farm';
      const branchPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;
  
      // Fetch the groups from the selected branch (or Main Farm)
      const groupsSnapshot = await getDocs(collection(firestore, branchPath));
  
      const femalePigsPromises = groupsSnapshot.docs.map(async (groupDoc) => {
        const pigsPath = `${branchPath}/${groupDoc.id}/pigs`; // Path to pigs in each group
        const pigsSnapshot = await getDocs(collection(firestore, pigsPath));
        const femalePigs = pigsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data(), groupName: groupDoc.data().name })) // Include the group name
          .filter(pig => pig.gender === 'female'); // Filter female pigs
        console.log(`Fetched female pigs from group ${groupDoc.id}:`, femalePigs); // Log fetched female pigs
        return femalePigs; // Return the filtered array
      });
  
      const femalePigsArrays = await Promise.all(femalePigsPromises);
      const allFemalePigs = femalePigsArrays.flat(); // Flatten the array to get a single array of female pigs
      console.log("All Female Pigs:", allFemalePigs); // Log all female pigs
      setFemalePigs(allFemalePigs);
    } catch (error) {
      console.error("Error fetching female pigs: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to fetch female pigs whenever the selected branch changes
  useEffect(() => {
    fetchFemalePigs();
  }, [selectedBranch, user.uid]);


  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      setDetailModalVisible(false);
      return () => {
        // Cleanup if necessary when losing focus
      };
    }, [])
  );


  // Fetch Pigs from the selected branch
  // Fetch Pigs from the selected branch
useEffect(() => {
  const fetchPigs = async () => {
    const pigsCollectionPath = selectedBranch === 'Main Farm'
      ? `users/${user.uid}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs`
      : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs`;
    
    const q = query(collection(firestore, pigsCollectionPath));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort pigs by tagNumber in ascending order
      allPigs.sort((a, b) => {
        const tagNumberA = parseInt(a.tagNumber, 10); // Convert to number
        const tagNumberB = parseInt(b.tagNumber, 10); // Convert to number
        return tagNumberA - tagNumberB; // Sort in ascending order
      });

      setPigs(allPigs);
      setFemalePigs(allPigs.filter(pig => pig.gender === 'female')); // Filter female pigs
    });

    return () => unsubscribe();
  };

  fetchPigs();
}, [pigGroupId, user.uid, selectedBranch]);
  // Check for duplicates
  const checkForDuplicates = async () => {
    const pigCollectionPath = `users/${user.uid}/farmBranches/${selectedBranch}/pigGroups/${pigGroupId}/pigs`;
  
    const q = query(collection(firestore, pigCollectionPath));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.some(doc => {
      const data = doc.data();
      return (data.pigName === pigName || data.tagNumber === tagNumber) && (currentPigId === null || doc.id !== currentPigId);
    });
  };

  // Add Pig
  const handleAddPig = async () => {
    // Validate input fields
    if (!pigName.trim() || !tagNumber.trim() || !gender || !race.trim()) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    // Determine the collection path based on the selected branch
    const pigCollectionPath = selectedBranch === 'Main Farm'
      ? `users/${user.uid}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs`
      : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs`;
  
    const newPig = {
      pigName,
      tagNumber,
      gender,
      race,
      dateOfBirth,
      vitality: isDeceased ? 'deceased' : 'alive',
      ...(isDeceased && { causeOfDeath, dateOfDeath }),
      createdAt: new Date(),
      motherId: selectedFemalePigId || null,
      motherName: motherName || ""
    };
  
    try {
      // Check network connectivity
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        // Online: Add pig immediately
        await addDoc(collection(firestore, pigCollectionPath), newPig);
  
        // Alert after adding pig
        Alert.alert('Success', 'Pig added successfully!');
      } else {
        // Offline: Queue the addition
        const offlinePigs = JSON.parse(await AsyncStorage.getItem('offlinePigs')) || [];
        offlinePigs.push(newPig);
        await AsyncStorage.setItem('offlinePigs', JSON.stringify(offlinePigs));
  
        // Alert for offline queue
        Alert.alert('Success', 'Pig addition queued for offline use!');
      }
  
      // Update the state to include the new pig
      setPigs((prevPigs) => [...prevPigs, { id: Date.now().toString(), ...newPig }]); // Add a temporary ID for the new pig
  
      // Reset fields and close modal
      resetFields();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding pig:', error);
      Alert.alert('Error', 'There was a problem adding the pig.');
    }
  };

  // Edit Pig
  const handleEditPig = async () => {
    if (!pigName.trim() || !tagNumber.trim() || !gender || !race.trim()) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

  const pigCollectionPath = selectedBranch === 'Main Farm'
    ? `users/${user.uid}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${currentPigId}`
    : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${currentPigId}`;

  try {
    // Update the main pig document
    await updateDoc(doc(firestore, pigCollectionPath), {
      pigId: currentPigId,
      pigName,
      tagNumber,
      gender,
      race,
      dateOfBirth,
      vitality: isDeceased ? 'deceased' : 'alive',
      ...(isDeceased && { causeOfDeath, dateOfDeath }),
      motherId: selectedFemalePigId || null,
      motherName: motherName || ""
    });

    // Update pigName in all motherRecords documents with matching pigId for Main Farm and Farm Branches
    await updateMotherRecordsInMainFarm(firestore, user.uid, currentPigId, pigName);
    await updateMotherRecordsInAllFarmBranches(firestore, user.uid, currentPigId, pigName);

    Alert.alert('Success', 'Pig name updated across all relevant records!');
    setIsEditing(false);
    resetFields();
  } catch (error) {
    console.error('Error updating pig records:', error);
    Alert.alert('Error', 'There was a problem updating the pig records.');
  }
};

// Function to update pigName in all motherRecords documents in Main Farm with matching pigId or document ID
const updateMotherRecordsInMainFarm = async (db, userId, pigId, newPigName) => {
  try {
    const mainFarmPath = `users/${userId}/farmBranches/Main Farm/pregnancyRecords`;

    const pregnancyRecordsSnapshot = await getDocs(collection(db, mainFarmPath));
    const batch = writeBatch(db);

    for (const pregnancyDoc of pregnancyRecordsSnapshot.docs) {
      const motherRecordsCollectionPath = `${mainFarmPath}/${pregnancyDoc.id}/motherRecords`;

      // Update documents where the document ID matches pigId
      if (pregnancyDoc.id === pigId) {
        batch.update(pregnancyDoc.ref, { pigName: newPigName });
      }

      // Query for documents in motherRecords where pigId matches
      const motherRecordsSnapshot = await getDocs(query(
        collection(db, motherRecordsCollectionPath),
        where("pigId", "==", pigId)
      ));

      motherRecordsSnapshot.forEach((motherRecordDoc) => {
        batch.update(motherRecordDoc.ref, { pigName: newPigName });
      });
    }

    await batch.commit();
  } catch (error) {
    console.error('Error updating motherRecords in Main Farm with pigId:', error);
  }
};

// Function to update pigName in all motherRecords documents in Farm Branches with matching pigId or document ID
const updateMotherRecordsInAllFarmBranches = async (db, userId, pigId, newPigName) => {
  try {
    const branchesPath = `users/${userId}/farmBranches/Farm Branch/Branches`;
    const branchesSnapshot = await getDocs(collection(db, branchesPath));

    const batch = writeBatch(db);

    for (const branchDoc of branchesSnapshot.docs) {
      const branchPregnancyRecordsPath = `${branchesPath}/${branchDoc.id}/pregnancyRecords`;
      const pregnancyRecordsSnapshot = await getDocs(collection(db, branchPregnancyRecordsPath));

      for (const pregnancyDoc of pregnancyRecordsSnapshot.docs) {
        const motherRecordsCollectionPath = `${branchPregnancyRecordsPath}/${pregnancyDoc.id}/motherRecords`;

        // Update documents where the document ID matches pigId
        if (pregnancyDoc.id === pigId) {
          batch.update(pregnancyDoc.ref, { pigName: newPigName });
        }

        // Query for documents in motherRecords where pigId matches
        const motherRecordsSnapshot = await getDocs(query(
          collection(db, motherRecordsCollectionPath),
          where("pigId", "==", pigId)
        ));

        motherRecordsSnapshot.forEach((motherRecordDoc) => {
          batch.update(motherRecordDoc.ref, { pigName: newPigName });
        });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error('Error updating motherRecords in Farm Branches with pigId:', error);
  }
};




   // Delete Pig
 // Delete Pig
const handleDeletePig = (pigId) => {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete this pig?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const pigCollectionPath = selectedBranch === 'Main Farm'
              ? `users/${user.uid}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${pigId}`
              : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${pigId}`;
            await deleteDoc(doc(firestore, pigCollectionPath));
            Alert.alert('Success', 'Pig deleted successfully!'); // Alert after deletion
          } catch (error) {
            console.error('Error deleting pig:', error);
            Alert.alert('Error', 'There was a problem deleting the pig.');
          }
        }
      },
    ],
    { cancelable: true }
  );
};

  const resetFields = () => {
    setPigName('');
    setTagNumber('');
    setGender('male');
    setRace('');
    setDateOfBirth(new Date());
    setIsDeceased(false);
    setCauseOfDeath('');
    setDateOfDeath(new Date());
    setSelectedFemalePig(null); // Clear selected mother
    setSelectedFemalePigId(null); // Clear mother ID
  };

  // Filter Pigs
  const filteredPigs = pigs.filter(pig => pig.pigName.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render Pig Item
  const renderPig = ({ item }) => (
    <View style={styles.pigContainer}>
      <View style={styles.pigInfo}>
        <Text style={styles.pigText}>Tag Number: {item.tagNumber}</Text>
        <Text style={styles.pigText}>Pig Name: {item.pigName}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => {
          setSelectedPig(item);
          setDetailModalVisible(true);
        }}>
          <Image source={viewIcon} style={styles.iview} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setPigName(item.pigName);
          setTagNumber(item.tagNumber);
          setGender(item.gender);
          setRace(item.race);
          setCurrentPigId(item.id);
          setVitality(item.vitality); // Set vitality when editing
          setIsEditing(true);
          setModalVisible(true);
        }}>
          <Image source={editIcon} style={styles.iedit} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePig(item.id)}>
          <Image source={deleteIcon} style={styles.idelete} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainheader}>
        <Text style={styles.title}>Pig Information</Text>
        <Text style={styles.groupName}>Current Pig Group: {pigGroupName}</Text>
      </View>
      <View style={styles.searchContainer}>
      <Button
          title="Add Pig"
          onPress={() => {
            setIsEditing(false);
            setIsDeceased(false); // Automatically alive when adding
            setModalVisible(true);
          }}
          style={styles.addButton}
          color="#566F48"
          
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pigs"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredPigs}
        renderItem={renderPig}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      
      {/* Add/Edit Pig Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        // animationType="slide"
        animationIn="fadeIn" // Fades in the modal
        animationOut="fadeOut" // Fades out the modal
        animationInTiming={500} // Duration of fadeIn (in milliseconds)
        animationOutTiming={800} // Duration of fadeOut (in milliseconds)
        backdropOpacity={1} // Background opacity when the modal is visible
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Pig' : 'Add Pig'}</Text>
          <View style={styles.modalContent}>
            <Text style={styles.titlename}>Pig Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Pig Name"
              value={pigName}
              onChangeText={setPigName}
            />
            
            <Text style={styles.titlename}>Tag Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Tag Number"
              value={tagNumber}
              onChangeText={setTagNumber}
              keyboardType="phone-pad"
            />
                       {/* Date of Birth Picker */}
            <TouchableOpacity onPress={handleOpenDatePicker}>
              <Text>Select Date of Birth</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                 isVisible={openDatePicker}
                mode="date"
                date={dateOfBirth}
                onConfirm={(date) => {
                  setDateOfBirth(date);
                  setOpenDatePicker(false);
             }}
              onCancel={() => setOpenDatePicker(false)}
              />
        
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
            <Text style={styles.titlename}>Race</Text>
            <TextInput
              style={styles.input}
              placeholder="Race"
              value={race}
              onChangeText={setRace}
            />

          {isEditing && (
            <View style={styles.switchContainer}>
              <Text>Is the pig deceased?</Text>
              <Switch
                value={isDeceased}
                onValueChange={setIsDeceased}
              />
            </View>
          )}



          {/* Show cause of death and date of death only if editing and the pig is deceased */}
          {isEditing && isDeceased && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Cause of Death"
                value={causeOfDeath}
                onChangeText={setCauseOfDeath}
              />
              <TouchableOpacity onPress={handleOpenDeathDatePicker}>
                <Text>Select Date of Death</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={openDeathDatePicker}
                mode="date"
                date={dateOfDeath}
                onConfirm={(date) => {
                  setDateOfDeath(date);
                  setOpenDeathDatePicker(false);
                }}
                onCancel={() => setOpenDeathDatePicker(false)}
              />
            </>
          )}
            <View style={styles.modalsavecancel}>
              <Button
                title={isEditing ? 'Update Pig' : 'Add Pig'}
                onPress={isEditing ? handleEditPig : handleAddPig}
                color="#4CAF50"
              />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="#f44336"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Pig Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Pig Details</Text>
          <View style={styles.modalContent}>
            {selectedPig && (
              <>
                <Text style={styles.detailText}>Name: {selectedPig.pigName}</Text>
                <Text style={styles.detailText}>Tag Number: {selectedPig.tagNumber}</Text>
                <Text style={styles.detailText}>Gender: {selectedPig.gender}</Text>
                <Text style={styles.detailText}>Race: {selectedPig.race}</Text>
                <Text style={styles.detailText}>Date of Birth: {selectedPig.dateOfBirth.toDate().toDateString()}</Text>
                <Text style={styles.detailText}>Vitality: {selectedPig.vitality}</Text>
                 {/* View Medical Records Button 
                <Text style={styles.detailText}>
                  Mother Name: {
                    selectedFemalePigId
                      ? femalePigs.find(pig => pig.id === selectedFemalePigId)?.pigName || 'N/A'
                      : 'N/A'
                  }
                </Text>
                            */}

                            
                  {/* View Medical Records Button */}
                  <Button
                    title="View Medical Records"
                    onPress={() => {
                      if (selectedPig) {
                        navigation.navigate('MedicalRecordScreen', {
                          userId: user.uid,
                          selectedBranch: selectedBranch, // Pass the selected branch
                          pigGroupId: pigGroupId,         // Pass the pig group ID
                          pigName: selectedPig.pigName,   // Pass the pig name
                          selectedPigId: selectedPig.id,   // Pass the selected pig ID
                        });
                      } else {
                        Alert.alert('Error', 'Please select a pig before viewing medical records.');
                      }
                    }}
                    color="#000000FF"
                  />
              </>
            )}
            <Button
              title="Close"
              onPress={() => setDetailModalVisible(false)}
              color="#f44336"
            />
          </View>
        </View>
      </Modal>

    </View>
  );
}