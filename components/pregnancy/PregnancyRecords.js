import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Image,TextInput } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, getDoc,updateDoc,setDoc,addDoc } from 'firebase/firestore';
import viewIcon from '../../assets/images/buttons/viewIcon.png';
import PregnancyRecordsStyles from '../../frontend/Pregnancy/PregnancyRecordsStyles';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

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
    if (breedingDate === '') {
      alert('Please select a breeding date.');
      return;
    }

    try {
      const pregnancyRecordPath = `users/${user.uid}/farmBranches/${selectedBranch === 'Main Farm' ? 'Main Farm' : `Farm Branch/Branches/${selectedBranch}`}/pregnancyRecords/${selectedPigId}`;
      const pregnancyRecordRef = doc(firestore, pregnancyRecordPath);
      const pregnancyRecordDoc = await getDoc(pregnancyRecordRef);
      if (!pregnancyRecordDoc.exists()) {
        await setDoc(pregnancyRecordRef, {
          motherRecords: {
            pigId: selectedPigId,
            pigName: selectedPigName,
          },
        });
      }
      const breedingDatesRef = collection(firestore, `${pregnancyRecordPath}/breedingDates`);
      await addDoc(breedingDatesRef, {
        breedingDate: breedingDate,
        remarks: remarks, // Add remarks to the record
        addedAt: new Date(),
      });
      alert('Breeding date added successfully');
      setModalVisible(false); // Close modal
    } catch (error) {
      console.error('Error adding breeding date: ', error);
      alert('Failed to add breeding date');
    }
  };
  
  
  const fetchBreedingHistory = async () => {
    try {
      const breedingDatesRef = collection(firestore, `users/${user.uid}/farmBranches/${selectedBranch === 'Main Farm' ? 'Main Farm' : `Farm Branch/Branches/${selectedBranch}`}/pregnancyRecords/${selectedPigId}/breedingDates`);
      const breedingSnapshot = await getDocs(breedingDatesRef);
      const history = breedingSnapshot.docs.map(doc => doc.data());
      setBreedingHistory(history);
    } catch (error) {
      console.error("Error fetching breeding history: ", error);
    }
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
    fetchFemalePigs();
  }, [selectedBranch, user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={PregnancyRecordsStyles.container}>
      <Text style={PregnancyRecordsStyles.header}>List of all Female Pigs</Text>
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
    <View style={PregnancyRecordsStyles.modalContainer}>
      
      {/* Modal for Viewing Piglets */}
      {modalType === 'piglets' && (
        <>
          <Text style={PregnancyRecordsStyles.modalHeader}>Piglets of {selectedPigName}</Text>
          {selectedPiglets.length === 0 ? (
            <Text>No piglets found for this pig.</Text>
          ) : (
            selectedPiglets.map(piglet => (
              <Text key={piglet.id}>{piglet.pigName} ({piglet.groupName})</Text>
            ))
          )}
          <TouchableOpacity
            style={PregnancyRecordsStyles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={PregnancyRecordsStyles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </>
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
          keyExtractor={(item, index) => index.toString()}
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





    </View>
  );
};

export default PregnancyRecords;
