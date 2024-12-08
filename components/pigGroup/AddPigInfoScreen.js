import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, Modal, TouchableOpacity, Image, Switch, SafeAreaView, ScrollView   } from 'react-native';
import { addDoc, collection, query, onSnapshot, doc, getDoc, updateDoc, deleteDoc, getDocs, where, writeBatch } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config2';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import deleteIcon from '../../assets/images/buttons/deleteIcon.png';
import editIcon from '../../assets/images/buttons/editIcon.png';
import viewIcon from '../../assets/images/buttons/viewIcon.png';
import soldIcon from '../../assets/images/buttons/soldIcon.png'; // Adjust the path as needed
import styles from '../../frontend/pigGroupStyles/AddPigInfoScreenStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect
import backImage from '../../assets/images/buttons/backbutton.png'; // Adjust the path as needed
import RNPickerSelect from 'react-native-picker-select';


export default function AddPigInfoScreen({ route }) {
  const navigation = useNavigation(); // Get the navigation object
  const { pigGroupId, selectedBranch, farmName  } = route.params; // Add selectedBranch param
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
 // const [dateOfBirth, setDateOfBirth] = useState(new Date());  // Date of birth state
  const [dateOfBirth, setDateOfBirth] = useState(null);

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
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control DatePicker visibility
  const [filterType, setFilterType] = useState('all'); // 'alive', 'deceased', 'all'
  const [soldModalVisible, setSoldModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('sales'); // Default category
  const [time, setTime] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const userId = user ? user.uid : null; // Ensure userId is defined
  const [moneyRecords, setMoneyRecords] = useState([]); // State to hold money records

  const handleConfirm = (date) => {
    if (date instanceof Date && !isNaN(date)) {
        setDateOfBirth(date);
    } else {
        console.warn("Invalid date selected");
    }
    setOpenDatePicker(false);
};

const handleConfirmBirthDate = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    setDateOfBirth(date);
  } else {
    console.warn("Invalid date selected");
  }
  setOpenDatePicker(false);
};

const handleConfirmDeathDate = (date) => {
  setDateOfDeath(date);
  setOpenDeathDatePicker(false);
};


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




  const filterPigs = (pigs) => {
    if (filterType === 'alive') {
      return pigs.filter(pig => pig.vitality === 'alive');
    } else if (filterType === 'deceased') {
      return pigs.filter(pig => pig.vitality === 'deceased');
    }
    return pigs; // Return all pigs if 'all' is selected
  };



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
    if (!pigName.trim() || !tagNumber.trim() || !gender || !race.trim()) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    const pigCollectionPath = selectedBranch === 'Main Farm'
      ? `users/${user.uid}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs`
      : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs`;
  
    try {
      await addDoc(collection(firestore, pigCollectionPath), {
        pigName,
        tagNumber,
        gender,
        race,
        dateOfBirth,
        vitality: isDeceased ? 'deceased' : 'alive',
        ...(isDeceased && { causeOfDeath, dateOfDeath }),
        createdAt: new Date(),
        motherId: selectedFemalePigId || null,       // Store mother pig's ID
        motherName: motherName || ""                 // Store mother pig's name
      });
  
      Alert.alert('Success', 'Pig added successfully!');
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

    Alert.alert('Success', 'Pig updated successfully!');
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

useEffect(() => {
  console.log('User  ID:', userId);
  console.log('Route Params:', route.params);
}, [userId, route.params]);

const handleAddMoney = async (pigId) => {
  // Check if amount is entered
  if (!amount) {
    Alert.alert('Error', 'Please enter an amount.');
    return;
  }

  // Construct Firestore path based on selectedBranch value
  const path = selectedBranch === 'Main Farm'
    ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
    : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;

  try {
    // Reference to the Firestore collection
    const moneyInRecordsRef = collection(firestore, path);

    // Create a money record object
    const moneyRecord = {
      amount: parseFloat(amount),
      category: category,
      date: date,
      time: time,
      remarks: remarks,
      createdAt: new Date(),
      pigId: pigId, // Add the selected pig ID to the money record
    };

    // Add the money record to the Firestore collection
    await addDoc(moneyInRecordsRef, moneyRecord);

    // Mark the pig as sold
    const pigCollectionPath = selectedBranch === 'Main Farm'
      ? `users/${userId}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${pigId}`
      : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${pigId}`;

    await updateDoc(doc(firestore, pigCollectionPath), {
      sold: true, // Mark the pig as sold
    });

    Alert.alert('Success', 'Money added and pig marked as sold successfully!');
    setAmount('');
    setRemarks('');
    setCategory('salary');
    setSoldModalVisible(false);
  } catch (error) {
    console.error('Error adding money record:', error);
    Alert.alert('Error', 'Failed to add money. Please try again.');
  }
};

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
              Alert.alert('Success', 'Pig deleted successfully!');
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


  const cancelSoldPig = async (pigId) => {
    try {
      // Update the pig document to set sold to false
      const pigCollectionPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/pigGroups/${pigGroupId}/pigs/${pigId}`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups/${pigGroupId}/pigs/${pigId}`;
  
      await updateDoc(doc(firestore, pigCollectionPath), {
        sold: false, // Mark the pig as not sold
      });
  
      // Now, remove the corresponding money record
      const moneyInRecordsPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;
  
      const moneyInQuery = query(collection(firestore, moneyInRecordsPath), where('pigId', '==', pigId));
      const querySnapshot = await getDocs(moneyInQuery);
  
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref); // Delete the money record associated with the sold pig
      });
  
      Alert.alert('Success', 'The sale has been canceled and the money record has been removed.');
    } catch (error) {
      console.error('Error canceling the sale:', error);
      Alert.alert('Error', 'There was an error canceling the sale. Please try again.');
    }
  };


  // Filter Pigs
  const filteredPigs = pigs.filter(pig => pig.pigName.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render Pig Item
// Render Pig Item
const renderPig = ({ item }) => {
  const isDeceased = item.vitality === 'deceased';
  const isSold = item.sold; // Check if the pig is sold

  const handleSoldPress = async () => {
    if (isSold) {
      // If the pig is already sold, ask if the user wants to cancel the sale
      Alert.alert(
        'Cancel Sale',
        'This pig is already marked as sold. Do you want to cancel the sale?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: async () => {
              await cancelSoldPig(item.id); // Call the function to cancel the sale
            }
          },
        ],
        { cancelable: true }
      );
    } else {
      // If the pig is not sold, proceed to mark it as sold
      setSoldModalVisible(true);
      setSelectedPig(item); // Set the selected pig to mark as sold
    }
  };

  return (
    <SafeAreaView style={[styles.pigContainer, isDeceased ? styles.deceasedPigContainer : null, isSold ? styles.soldPigContainer : null]}>
      <View style={styles.pigInfo}>
        <Text style={[styles.pigText, isDeceased ? styles.deceasedText : null, isSold ? styles.soldText : null]}>
          Tag Number: {item.tagNumber}
        </Text>
        <Text style={[styles.pigText, isDeceased ? styles.deceasedText : null, isSold ? styles.soldText : null]}>
          Pig Name: {isSold ? 'Sold' : isDeceased ? 'Deceased' : item.pigName}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        {/* Sold Icon */}
        <TouchableOpacity onPress={handleSoldPress}>
          <Image source={soldIcon} style={styles.isold} />
        </TouchableOpacity>
        
        {/* View Icon */}
        <TouchableOpacity onPress={() => {
          setSelectedPig(item);
          setDetailModalVisible(true);
        }}>
          <Image source={viewIcon} style={styles.iview} />
        </TouchableOpacity>
        
        {/* Edit Icon */}
        <TouchableOpacity onPress={() => {
          setPigName(item.pigName);
          setTagNumber(item.tagNumber);
          setGender(item.gender);
          setRace(item.race);
          setCurrentPigId(item.id);
          setVitality(item.vitality);
          setIsEditing(true);
          setModalVisible(true);
        }}>
          <Image source={editIcon} style={styles.iedit} />
        </TouchableOpacity>
        
        {/* Delete Icon */}
        <TouchableOpacity onPress={() => handleDeletePig(item.id)}>
          <Image source={deleteIcon} style={styles.idelete} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainheader}>
        <View style={{flexDirection: 'row', marginBottom: 10, }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.navibackButton}>
            <Image source={backImage} style={styles.backImage} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Pig Information</Text>
        </View>
        <View style={styles.searchContainer}>
          <Image 
                source={require('../../assets/images/search.png')}
                style={styles.iconsearch}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by pigs"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.groupnameContainer}>
        <Text style={[styles.groupname, styles.groupNametext]}>Current Pig Group:</Text>
        <Text style={[styles.groupname, styles.groupNamevalue]}>{pigGroupName}</Text>
      </View>

  <View style={styles.filterButtonContainer}>
    <TouchableOpacity style={styles.buttonAlive} onPress={() => setFilterType('alive')}>
      <Text style={styles.buttonText}>Show {'\n'}Alive</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonDeceased} onPress={() => setFilterType('deceased')}>
      <Text style={styles.buttonText}>Show{'\n'} Deceased</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonAll} onPress={() => setFilterType('all')}>
      <Text style={styles.buttonText}>Show{'\n'} All</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonSold} onPress={() => setFilterType('all')}>
      <Text style={styles.buttonText}>Sold{'\n'} Pig</Text>
    </TouchableOpacity>
  </View>

{/* FlatList for Pig Items */}
<FlatList
  data={filterPigs(filteredPigs)}
  renderItem={renderPig}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.listContent}
/>

<Modal
  visible={soldModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setSoldModalVisible(false)}
>
  <View style={styles.modalContainer}>
  <Text style={styles.modalTitle}>Sold Pig Details</Text>
  <View style={styles.modalContent}>
      <Text style={styles.titlename}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      
      <Text style={styles.titlename}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        editable={false} // Make it read-only since it's default
      />
      
      <Text style={styles.titlename}>Date</Text>
      <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
        <Text style={styles.datePickerText}>
          {date.toLocaleDateString('en-US')}
        </Text>
      </TouchableOpacity>

      <Text style={styles.titlename}>Time</Text>
      <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
        <Text style={styles.datePickerText}>
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>

      <Text style={styles.titlename}>Remarks</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Remarks"
        value={remarks}
        onChangeText={setRemarks}
      />

      <View style={styles.modalsavecancel}>
      <Button
      title="Add Sold Pig"
      onPress={() => handleAddMoney(selectedPig.id)} // Ensure selectedPig is an object with an id
      color="#4CAF50"
    />
        <Button
          title="Cancel"
          onPress={() => setSoldModalVisible(false)}
          color="#f44336"
        />
      </View>
    </View>
  </View>
</Modal>
      
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
                       <TouchableOpacity 
        onPress={handleOpenDatePicker} 
        style={styles.datePickerButton}
        >
        <Text style={styles.datePickerText}>
            {dateOfBirth ? dateOfBirth.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Select Date of Birth'}
        </Text>
              </TouchableOpacity>


              <DateTimePickerModal
  isVisible={openDatePicker}
  mode="date"
  date={dateOfBirth || new Date()} // Ensure date is never null
  onConfirm={handleConfirmBirthDate} // Use the birth date handler
  onCancel={() => setOpenDatePicker(false)}
/>


        
<RNPickerSelect
  onValueChange={(value) => setGender(value)} // Update the gender state
  items={[
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]}
  style={styles.picker} // Ensure you have styles defined for the picker
  placeholder={{ label: 'Select Gender', value: null }} // Optional placeholder
/>
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
  <Text>
    {dateOfDeath ? dateOfDeath.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Select Date of Death'}
  </Text>
</TouchableOpacity>

<DateTimePickerModal
  isVisible={openDeathDatePicker}
  mode="date"
  date={dateOfDeath || new Date()} 
  onConfirm={handleConfirmDeathDate} 
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
                <Text style={styles.detailText}>Date of Birth: {selectedPig.dateOfBirth ? selectedPig.dateOfBirth.toDate().toDateString() : 'N/A'}</Text>                
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(false);
              setIsDeceased(false); // Automatically alive when adding
              setModalVisible(true);
            }}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Add Pig Group</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}