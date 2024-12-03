import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, setDoc, writeBatch, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import PigDetailsScreenStyles from '../../frontend/Pregnancy/PigDetailsScreenStyles';
import backImage from '../../assets/images/buttons/backbutton.png'; // Adjust the path as needed

const PigDetailsScreen = ({ route, navigation }) => {
  const { selectedBranch, user, pigId, pigName } = route.params;
  const [allPigs, setAllPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPiglets, setSelectedPiglets] = useState([]);
  const [assignedPiglets, setAssignedPiglets] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const fetchSelectedPiglets = async () => {
    try {
      const pregnancyRecordPath = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}`;

      const pregnancyDocRef = doc(firestore, pregnancyRecordPath);
      const existingRecordSnapshot = await getDoc(pregnancyDocRef);
      if (existingRecordSnapshot.exists()) {
        const existingRecord = existingRecordSnapshot.data();
        const piglets = existingRecord.piglets || [];
        setSelectedPiglets(piglets.map(piglet => piglet.id)); // Set selected piglets based on existing record
      }
    } catch (error) {
      console.error("Error fetching selected piglets: ", error);
    }
  };

  useEffect(() => {
    fetchAllPigs();
    fetchAssignedPiglets();
    fetchSelectedPiglets(); // Fetch selected piglets when the component mounts
  }, [selectedBranch, user]);
  const fetchAllPigs = async () => {
    setLoading(true);
    try {
      const isMainFarm = selectedBranch === 'Main Farm';
      const branchPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

      const groupsSnapshot = await getDocs(collection(firestore, branchPath));
      let pigsList = [];

      for (const groupDoc of groupsSnapshot.docs) {
        const groupName = groupDoc.data().name;
        const pigsPath = `${branchPath}/${groupDoc.id}/pigs`;
        const pigsSnapshot = await getDocs(collection(firestore, pigsPath));

        const groupPigs = pigsSnapshot.docs.map(doc => ({
          id: doc.id,
          pigName: doc.data().pigName,
          gender: doc.data().gender,
          groupName,
        }));

        pigsList = [...pigsList, ...groupPigs];
      }

      setAllPigs(pigsList);
    } catch (error) {
      console.error("Error fetching pigs: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedPiglets = async () => {
    try {
      const isMainFarm = selectedBranch === 'Main Farm';
      const pregnancyRecordsPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords`;

      const recordsSnapshot = await getDocs(collection(firestore, pregnancyRecordsPath));
      const pigletsAssignments = {};

      for (const record of recordsSnapshot.docs) {
        const motherId = record.id;
        const motherData = record.data();
        const motherName = motherData.pigName || 'Unnamed Mother';
        const piglets = motherData.piglets || [];

        piglets.forEach(piglet => {
          pigletsAssignments[piglet.id] = motherName;
        });
      }

      setAssignedPiglets(pigletsAssignments);
    } catch (error) {
      console.error("Error fetching assigned piglets: ", error);
    }
  };

  useEffect(() => {
    fetchAllPigs();
    fetchAssignedPiglets();
  }, [selectedBranch, user]);

  const saveSelectedPigs = async () => {
    try {
      if (!user) return;
  
      const pregnancyRecordPath = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}`;
  
      const pregnancyDocRef = doc(firestore, pregnancyRecordPath);
      const existingRecordSnapshot = await getDoc(pregnancyDocRef);
      const existingRecord = existingRecordSnapshot.exists() ? existingRecordSnapshot.data() : null;
  
      // Set up the updated pregnancy record document
      const updatedPregnancyRecordDoc = {
        pigName: pigName || 'Unnamed Pig',
        id: pigId,
        date: new Date().toISOString(),
        piglets: existingRecord ? existingRecord.piglets || [] : []
      };
  
      const motherRecordsPath = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}/motherRecords`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}/motherRecords`;
  
      const batch = writeBatch(firestore);
  
      // Find piglets to be removed (in Firestore but not in selectedPiglets)
      const pigletsToRemove = updatedPregnancyRecordDoc.piglets.filter(
        p => !selectedPiglets.includes(p.id)
      );
  
      // Remove deselected piglets from motherRecords in Firestore
      pigletsToRemove.forEach(piglet => {
        const pigletRecordRef = doc(firestore, motherRecordsPath, piglet.id);
        batch.delete(pigletRecordRef);
      });
  
      // Clear removed piglets from the updated pregnancy record
      updatedPregnancyRecordDoc.piglets = updatedPregnancyRecordDoc.piglets.filter(
        p => selectedPiglets.includes(p.id)
      );
  
      // Add newly selected piglets to updatedPregnancyRecordDoc and motherRecords
      selectedPiglets.forEach(id => {
        const piglet = allPigs.find(p => p.id === id);
        if (piglet && !updatedPregnancyRecordDoc.piglets.find(p => p.id === id)) {
          updatedPregnancyRecordDoc.piglets.push({ id, pigName: piglet.pigName });
  
          const pigletData = {
            pigName: piglet.pigName,
            pigId: piglet.id,
            group: piglet.groupName
          };
          const pigletRecordRef = doc(collection(firestore, motherRecordsPath));
          batch.set(pigletRecordRef, pigletData);
        }
      });
  
      // Save updated pregnancy record document
      await setDoc(pregnancyDocRef, updatedPregnancyRecordDoc, { merge: true });
      await batch.commit();
  
      Alert.alert('Success', 'Pregnancy record and selected piglets saved successfully.');
    } catch (error) {
      console.error('Error saving pregnancy record and piglets:', error);
      Alert.alert('Error', 'Failed to save pregnancy record and piglets. Please try again.');
    }
  };
  


  const togglePigletSelection = async (pigletId) => {
    const isSelected = selectedPiglets.includes(pigletId);
    
    // Path for the pregnancy record document
    const pregnancyRecordPath = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}`;
    const pregnancyDocRef = doc(firestore, pregnancyRecordPath);
    
    // Path for the motherRecords sub-collection
    const motherRecordsPath = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}/motherRecords`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}/motherRecords`;
  
    try {
        if (isSelected) {
            // Show confirmation alert before deselecting
            Alert.alert(
                'Confirm Removal',
                `Do you want to remove this piglet from its mother?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Removal canceled'),
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            // Deselect piglet: remove it from selected piglets
                            setSelectedPiglets(prevSelected => {
                                const updatedSelected = prevSelected.filter(id => id !== pigletId);
                                return updatedSelected;
                            });

                            // Fetch the current pregnancy record document
                            const existingRecordSnapshot = await getDoc(pregnancyDocRef);
                            if (existingRecordSnapshot.exists()) {
                                const existingRecord = existingRecordSnapshot.data();

                                // Remove the piglet from the piglets array
                                const updatedPiglets = existingRecord.piglets.filter(p => p.id !== pigletId);

                                // Update Firestore without the deselected piglet
                                await setDoc(pregnancyDocRef, { piglets: updatedPiglets }, { merge: true });

                                // Now, remove the corresponding motherRecords entry where pigId matches pigletId
                                const querySnapshot = await getDocs(query(collection(firestore, motherRecordsPath), where("pigId", "==", pigletId)));

                                if (!querySnapshot.empty) {
                                    // If a matching record is found, delete it
                                    querySnapshot.forEach(async (doc) => {
                                        await deleteDoc(doc.ref);
                                        console.log(`Deleted mother record for pigId: ${pigletId}`);
                                    });
                                } else {
                                    console.error(`No mother record found for pigId: ${pigletId}`);
                                }
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            // Select piglet: add it to selected piglets
            setSelectedPiglets(prevSelected => [...prevSelected, pigletId]);
        }
    } catch (error) {
        console.error('Error updating selection:', error);
        Alert.alert('Error', 'Failed to update piglet selection. Please try again.');
    }
};

// Filter pigs based on the search query
const filteredPigs = allPigs.filter(pig =>
  pig.pigName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  pig.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  pig.gender.toLowerCase().includes(searchQuery.toLowerCase())
);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={PigDetailsScreenStyles.container}>

      <Text style={PigDetailsScreenStyles.title}>Pig Details</Text>
      
      <Text style={PigDetailsScreenStyles.pigInfo}>Mothers Name: {pigName}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={PigDetailsScreenStyles.backButton}>
            <Image source={backImage} style={PigDetailsScreenStyles.backImage} />
          </TouchableOpacity>
       {/*  <Text style={PigDetailsScreenStyles.pigInfo}>Pig ID: {pigId}</Text> */}

      <View style={PigDetailsScreenStyles.headerContainer}>
        <Text style={PigDetailsScreenStyles.header}>All Pigs</Text>
        <TextInput
          style={PigDetailsScreenStyles.searchInput}
          placeholder="Search by name, Group Name, or gender"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
  data={filteredPigs}
  keyExtractor={item => item.id}
  numColumns={2}
  renderItem={({ item }) => {
    const assignedMotherName = assignedPiglets[item.id] || null;
    const isAssignedToDifferentMother = assignedMotherName && assignedMotherName !== pigName;

    return (
      <View style={PigDetailsScreenStyles.pigContainer}>
        <Text style={PigDetailsScreenStyles.detail}>Name: {item.pigName}</Text>
        <Text style={PigDetailsScreenStyles.detail}>Group: {item.groupName}</Text>
        <Text style={PigDetailsScreenStyles.detail}>Gender: {item.gender}</Text>
        
        {/* Show assigned text for all piglets regardless of selection */}
        {assignedMotherName && (
          <Text style={PigDetailsScreenStyles.assignedText}>
            Assigned to mother: {assignedMotherName}
          </Text>
        )}
        
        <TouchableOpacity
          style={[
            PigDetailsScreenStyles.selectButton,
            isAssignedToDifferentMother ? PigDetailsScreenStyles.disabledButton : null,
            selectedPiglets.includes(item.id) && PigDetailsScreenStyles.selectedButton,
          ]}
          onPress={() => togglePigletSelection(item.id)}
          disabled={isAssignedToDifferentMother} // Disable button if assigned to a different mother
        >
          <Text style={PigDetailsScreenStyles.buttonText}>
          {isAssignedToDifferentMother
            ? `Already assigned to ${assignedMotherName}` // Using template literals
            : selectedPiglets.includes(item.id)
            ? "Deselect Piglet"
            : "Select as Piglet"}
        </Text>
        </TouchableOpacity>
      </View>
    );
  }}
/>

      <Button
        title="Save Selected Pigs"
        onPress={saveSelectedPigs}
        color="#4CAF50"
      />
    </View>
  );
};
 

export default PigDetailsScreen;