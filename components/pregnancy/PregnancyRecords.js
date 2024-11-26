import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Image,TextInput, ScrollView } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, getDoc,updateDoc,setDoc,addDoc } from 'firebase/firestore';
import viewIcon from '../../assets/images/buttons/viewIcon.png';
import PregnancyRecordsStyles from '../../frontend/Pregnancy/PregnancyRecordsStyles';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
const PregnancyRecords = ({ route, navigation }) => {
  const { selectedBranch, user } = route.params || {};

  if (!selectedBranch || !user) {
    return <Text>Error: Missing branch or user information.</Text>;
  }

  const [femalePigs, setFemalePigs] = useState({ sortedGroups: [], groupedPigs: {} });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPiglets, setSelectedPiglets] = useState([]);
  const [selectedPigName, setSelectedPigName] = useState('');
  const [breedingDate, setBreedingDate] = useState('');
  const [selectedPigId, setSelectedPigId] = useState('');
  const [modalType, setModalType] = useState(''); // 'piglets' or 'breeding'
  const [remarks, setRemarks] = useState(''); // State for remarks
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control DatePicker visibility
  const [breedingHistoryVisible, setBreedingHistoryVisible] = useState(false); // For controlling breeding history modal visibility
  const [breedingHistory, setBreedingHistory] = useState([]); // To store the fetched breeding history
  const [isAdding, setIsAdding] = useState(false);

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      // Format the date as "Month Day, Year" (e.g., "November 7, 2024")
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(selectedDate);
      
      setBreedingDate(formattedDate); // Set the formatted date
    }
    setShowDatePicker(false); // Hide the DatePicker after selection
  };
  
  const fetchFemalePigs = async () => {
    setLoading(true);
    try {
      const isMainFarm = selectedBranch === 'Main Farm';
      const branchPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

      const groupsSnapshot = await getDocs(collection(firestore, branchPath));
      const femalePigsPromises = groupsSnapshot.docs.map(async (groupDoc) => {
        const pigsPath = `${branchPath}/${groupDoc.id}/pigs`;
        const pigsSnapshot = await getDocs(collection(firestore, pigsPath));
        const femalePigs = pigsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            groupName: groupDoc.data().name,
            motherId: doc.data().motherId,
          }))
          .filter(pig => pig.gender === 'female');
        return femalePigs;
      });

      const femalePigsArrays = await Promise.all(femalePigsPromises);
      const allFemalePigs = femalePigsArrays.flat();

      const groupedPigs = {};
      allFemalePigs.forEach(pig => {
        if (!groupedPigs[pig.groupName]) {
          groupedPigs[pig.groupName] = [];
        }
        groupedPigs[pig.groupName].push(pig);
      });

      const sortedGroups = Object.keys(groupedPigs).sort();

      setFemalePigs({ sortedGroups, groupedPigs });
    } catch (error) {
      console.error("Error fetching female pigs: ", error);
    } finally {
      setLoading(false);
    }
  };


  const addBreedingDate = async () => {
    if (isAdding) return;
    setIsAdding(true);
  
    if (breedingDate === '') {
      alert('Please select a breeding date.');
      setIsAdding(false);
      return;
    }
  
    const breedingData = {
      breedingDate: breedingDate,
      remarks: remarks,
      addedAt: new Date(),
    };
  
    const isConnected = await checkInternetConnection();
  
    if (isConnected) {
      try {
        const pregnancyRecordPath = `users/${user.uid}/farmBranches/${selectedBranch === 'Main Farm' ? 'Main Farm' : `Farm Branch/Branches/${selectedBranch}`}/pregnancyRecords/${selectedPigId}`;
        const breedingDateId = breedingDate.replace(/\s+/g, '_'); // Create a unique ID based on the date
        const breedingDateRef = doc(firestore, `${pregnancyRecordPath}/breedingDates`, breedingDateId);
  
        const docSnap = await getDoc(breedingDateRef);
        if (docSnap.exists()) {
          alert('This breeding date is already added.');
        } else {
          await setDoc(breedingDateRef, breedingData);
          alert('Breeding date added successfully');
        }
  
        setModalVisible(false);
      } catch (error) {
        console.error('Error adding breeding date: ', error);
        alert('Failed to add breeding date');
      }
    } else {
      // Handle offline storage here
      await addBreedingDateOffline(); // Store breeding date offline when disconnected
    }
  
    setIsAdding(false);
  };
  
  const syncBreedingData = async () => {
    await syncLocalBreedingData();
    await cleanSyncedLocalData(); // Clean up after syncing
  };
  
  
  
  const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
  };
  
  const syncLocalBreedingData = async () => {
    try {
      const localBreedingData = await AsyncStorage.getItem('localBreedingData');
      if (localBreedingData) {
        const breedingArray = JSON.parse(localBreedingData);
  
        for (const breeding of breedingArray) {
          // Skip already synced records
          if (breeding.isSynced) continue;
  
          const pregnancyRecordPath = `users/${user.uid}/farmBranches/${
            selectedBranch === 'Main Farm' ? 'Main Farm' : `Farm Branch/Branches/${selectedBranch}`
          }/pregnancyRecords/${breeding.pigId}`;
          const breedingDateId = breeding.breedingDate.replace(/\s+/g, '_'); // Unique ID based on date
          const breedingDateRef = doc(firestore, `${pregnancyRecordPath}/breedingDates`, breedingDateId);
  
          const docSnap = await getDoc(breedingDateRef);
          if (!docSnap.exists()) {
            await setDoc(breedingDateRef, breeding); // Add if not already in Firestore
            breeding.isSynced = true; // Mark as synced
          } else {
            console.log(`Breeding date ${breeding.breedingDate} already exists in Firestore.`);
          }
        }
  
        // Update local storage to reflect synced status
        const updatedBreedingArray = breedingArray.filter(item => !item.isSynced || item.isSynced);
        await AsyncStorage.setItem('localBreedingData', JSON.stringify(updatedBreedingArray));
      }
    } catch (error) {
      console.error('Error syncing local breeding data: ', error);
    }
  };
  



  const cleanSyncedLocalData = async () => {
    try {
      const localBreedingData = await AsyncStorage.getItem('localBreedingData');
      if (localBreedingData) {
        const breedingArray = JSON.parse(localBreedingData);
        const unsyncedBreedingData = breedingArray.filter(breeding => !breeding.isSynced);
        await AsyncStorage.setItem('localBreedingData', JSON.stringify(unsyncedBreedingData));
      }
    } catch (error) {
      console.error('Error cleaning synced data: ', error);
    }
  };
  
  
  
  const addBreedingDateOffline = async () => {
    const breedingData = {
      breedingDate: breedingDate,
      remarks: remarks,
      addedAt: new Date(),
      isSynced: false, // Mark as not synced
    };
  
    try {
      const localBreedingData = await AsyncStorage.getItem('localBreedingData') || '[]';
      const localBreedingArray = JSON.parse(localBreedingData);
  
      // Check for duplicates locally
      const isDuplicate = localBreedingArray.some(
        item => item.breedingDate === breedingData.breedingDate && item.pigId === selectedPigId
      );
  
      if (isDuplicate) {
        alert('This breeding date is already stored locally.');
        return;
      }
  
      localBreedingArray.push({ ...breedingData, pigId: selectedPigId });
      await AsyncStorage.setItem('localBreedingData', JSON.stringify(localBreedingArray));
      alert('Breeding date stored locally. It will sync when online.');
    } catch (error) {
      console.error('Error storing breeding date locally: ', error);
    }
  };
  
  
  
  
  const fetchBreedingHistory = async () => {
    const breedingHistorySet = new Map(); // Use a Map to avoid duplicates
    const breedingHistoryArray = [];
  
    // Fetch from Firestore
    try {
      const pregnancyRecordPath = `users/${user.uid}/farmBranches/${
        selectedBranch === 'Main Farm' ? 'Main Farm' : `Farm Branch/Branches/${selectedBranch}`
      }/pregnancyRecords/${selectedPigId}/breedingDates`;
      const breedingDatesRef = collection(firestore, pregnancyRecordPath);
      const snapshot = await getDocs(breedingDatesRef);
  
      snapshot.forEach(doc => {
        breedingHistorySet.set(doc.id, { id: doc.id, ...doc.data(), source: 'online' });
      });
    } catch (error) {
      console.error('Error fetching breeding history from Firestore: ', error);
    }
  
    // Fetch from AsyncStorage
    try {
      const localBreedingData = await AsyncStorage.getItem('localBreedingData');
      if (localBreedingData) {
        const localBreedingArray = JSON.parse(localBreedingData);
        localBreedingArray
          .filter(item => item.pigId === selectedPigId)
          .forEach(item => {
            const breedingDateId = item.breedingDate.replace(/\s+/g, '_');
            if (!breedingHistorySet.has(breedingDateId)) {
              breedingHistorySet.set(breedingDateId, { ...item, source: 'offline' });
            }
          });
      }
    } catch (error) {
      console.error('Error fetching local breeding data: ', error);
    }
  
    setBreedingHistory(Array.from(breedingHistorySet.values()));
  };
  
  
  


  const fetchPiglets = async (pigId, pigName) => {
    setSelectedPiglets([]);
    setSelectedPigName(pigName);
    setModalType('piglets'); // Set modal type to piglets
    setModalVisible(true);

    try {
      const motherRecordsPath = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}/motherRecords`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}/motherRecords`;

      const pigletsSnapshot = await getDocs(collection(firestore, motherRecordsPath));
      const pigletsPromises = pigletsSnapshot.docs.map(async (doc) => {
        const pigletData = doc.data();
        const pigletGroupDoc = await getDoc(doc.ref.parent.parent);  // Get the parent group document
        const groupName = pigletGroupDoc ? pigletGroupDoc.data().name : 'Unknown Group';
        return { id: doc.id, ...pigletData, groupName };
      });

      const piglets = await Promise.all(pigletsPromises);
      setSelectedPiglets(piglets);
    } catch (error) {
      console.error("Error fetching piglets: ", error);
    }
  };
  useEffect(() => {
    if (breedingHistoryVisible) {
      fetchBreedingHistory();
    }
  }, [breedingHistoryVisible]);
  useEffect(() => {
    fetchFemalePigs();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncLocalBreedingData();
      }
    });
    return () => unsubscribe();
  }, [selectedBranch, user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={PregnancyRecordsStyles.container}>
      <Text style={PregnancyRecordsStyles.header}>List of all Female Pigs</Text>
      <ScrollView style={PregnancyRecordsStyles.container}>
      {femalePigs.sortedGroups.length === 0 ? (
        <Text>No female pigs found.</Text>
      ) : (
        femalePigs.sortedGroups.map(group => (
          <View key={group}>
            <Text style={PregnancyRecordsStyles.groupName}>{group}</Text>
            {femalePigs.groupedPigs[group].map(pig => (
              <View key={pig.id} style={PregnancyRecordsStyles.pigContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('PigDetailsScreen', {
                  pigId: pig.id,
                  pigName: pig.pigName,
                  selectedBranch,
                  user,
                  motherId: pig.motherId
                })}>
                  <Text style={PregnancyRecordsStyles.pigName}>{pig.pigName}</Text>
                </TouchableOpacity>
                <View style={PregnancyRecordsStyles.iconContainer}>
                  <TouchableOpacity onPress={() => fetchPiglets(pig.id, pig.pigName)}>
                    <Image source={viewIcon} style={PregnancyRecordsStyles.viewIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={PregnancyRecordsStyles.addButton}
                    onPress={() => navigation.navigate('PigDetailsScreen', {
                      pigId: pig.id,
                      pigName: pig.pigName,
                      selectedBranch,
                      user,
                      motherId: pig.motherId
                    })}>
                    <Text style={PregnancyRecordsStyles.addButtonText}>Add Piglets</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={PregnancyRecordsStyles.addBreedingDateButton}
                    onPress={() => {
                      setSelectedPigId(pig.id);
                      setSelectedPigName(pig.pigName);
                      setModalType('breeding'); // Set modal type to breeding
                      setModalVisible(true);
                    }}>
                    <Text style={PregnancyRecordsStyles.addBreedingDateText}>Breed date</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))
      )}

      {/* Combined Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
  <View style={PregnancyRecordsStyles.modalBackground}>
    <View style={PregnancyRecordsStyles.pigletModalContent}>
      
{/* Modal for Viewing Piglets */}
{modalType === 'piglets' && (
  <View>
    <View>
      <Text style={PregnancyRecordsStyles.pigletModalHeader}>Piglets of {selectedPigName}</Text>
      <Text style={PregnancyRecordsStyles.pigletCountText}>
        Number of Piglets: {selectedPiglets.length} {/* Display total piglets count */}
      </Text>
      <ScrollView 
        style={PregnancyRecordsStyles.pigletsList} 
        contentContainerStyle={{ paddingBottom: 20 }} // Adds padding to the end for better spacing
      >
        {selectedPiglets.length === 0 ? (
          <Text style={PregnancyRecordsStyles.noPigletsText}>No piglets found for this pig.</Text>
        ) : (
          selectedPiglets.map(piglet => (
            <Text key={piglet.id} style={PregnancyRecordsStyles.pigletText}>
              Pig Name: {piglet.pigName}
            </Text>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={PregnancyRecordsStyles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={PregnancyRecordsStyles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
)}




      {/* Modal for Adding Breeding Date */}
      {modalType === 'breeding' && (
        <>
          <Text style={PregnancyRecordsStyles.modalHeader}>Add Breeding Date</Text>
          <Text style={PregnancyRecordsStyles.pigName}>{selectedPigName}</Text>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)} // Show the DatePicker when clicked
            style={PregnancyRecordsStyles.dateButton}>
            <Text style={PregnancyRecordsStyles.dateText}>{breedingDate || 'Select Breeding Date'}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TextInput
            style={PregnancyRecordsStyles.remarksInput}
            placeholder="Enter Remarks"
            value={remarks}
            onChangeText={setRemarks}
          />

          <TouchableOpacity style={PregnancyRecordsStyles.addButton} onPress={addBreedingDate}>
            <Text style={PregnancyRecordsStyles.addButtonText}>Add Breeding Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
  style={PregnancyRecordsStyles.viewBreedingHistoryButton}
  onPress={() => {
    fetchBreedingHistory();
    setBreedingHistoryVisible(true); // Show breeding history modal
  }}>
  <Text style={PregnancyRecordsStyles.viewBreedingHistoryText}>View Breeding History</Text>
  
</TouchableOpacity>

          <TouchableOpacity
            style={PregnancyRecordsStyles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={PregnancyRecordsStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </>
      )}
      
    </View>
  </View>
</Modal>
<Modal visible={breedingHistoryVisible} transparent={true} animationType="slide">
  <View style={PregnancyRecordsStyles.modalBackground}>
    <View style={PregnancyRecordsStyles.breedingHistoryModalContainer}>
      <Text style={PregnancyRecordsStyles.modalHeader}>Breeding History of {selectedPigName}</Text>
      
      {breedingHistory.length === 0 ? (
        <Text style={PregnancyRecordsStyles.noBreedingHistoryText}>No breeding history</Text>
      ) : (
        <FlatList
          data={breedingHistory}
          keyExtractor={(item) => item.id ? item.id : item.breedingDate} // Use id if available, else fallback to breedingDate
          renderItem={({ item }) => (
            <View style={PregnancyRecordsStyles.breedingHistoryItem}>
              <View style={PregnancyRecordsStyles.breedingHistoryTextContainer}>
                <Text style={PregnancyRecordsStyles.breedingHistoryLabel}>Breeding Date: {item.breedingDate}</Text>
                <Text style={PregnancyRecordsStyles.breedingHistoryLabel}>Remarks: {item.remarks}</Text>
              </View>
            </View>
          )}
        />
      )}
      
      <TouchableOpacity
        style={PregnancyRecordsStyles.closeButton}
        onPress={() => setBreedingHistoryVisible(false)}
      >
        <Text style={PregnancyRecordsStyles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
</ScrollView>





    </View>
  );
};

export default PregnancyRecords;
