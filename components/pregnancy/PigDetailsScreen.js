import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity, Alert, TextInput } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, setDoc, writeBatch, getDoc } from 'firebase/firestore';
import PigDetailsScreenStyles from '../../frontend/Pregnancy/PigDetailsScreenStyles';

const PigDetailsScreen = ({ route }) => {
  const { selectedBranch, user, pigId, pigName } = route.params;
  const [allPigs, setAllPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPiglets, setSelectedPiglets] = useState([]);
  const [assignedPiglets, setAssignedPiglets] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

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

        // Path for the pregnancy record document
        const pregnancyRecordPath = selectedBranch === 'Main Farm'
            ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}`
            : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}`;

        const pregnancyDocRef = doc(firestore, pregnancyRecordPath);
        const existingRecordSnapshot = await getDoc(pregnancyDocRef);
        const existingRecord = existingRecordSnapshot.exists() ? existingRecordSnapshot.data() : null;

        // Create a new pregnancy record document if none exists
        const updatedPregnancyRecordDoc = {
            pigName: pigName || 'Unnamed Pig',
            id: pigId,
            date: new Date().toISOString(),
            piglets: existingRecord ? existingRecord.piglets || [] : []
        };

        // Prepare the path for motherRecords as a sub-collection of the pregnancy record
        const motherRecordsPath = selectedBranch === 'Main Farm'
            ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}/motherRecords`
            : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}/motherRecords`;

        const batch = writeBatch(firestore);
        
        // Loop through selected piglets to add to both pregnancy record and motherRecords
        selectedPiglets.forEach(id => {
            const piglet = allPigs.find(p => p.id === id);
            if (piglet) {
                // Add piglet to the pregnancy record
                if (!updatedPregnancyRecordDoc.piglets.find(p => p.id === id)) {
                    updatedPregnancyRecordDoc.piglets.push({ id, pigName: piglet.pigName });
                }

                // Prepare motherRecords data
                const pigletData = {
                  pigName: piglet.pigName,
                    pigId: piglet.id,
                    group: piglet.groupName
                };
                const pigletRecordRef = doc(collection(firestore, motherRecordsPath));

                // Set the piglet record in motherRecords
                batch.set(pigletRecordRef, pigletData);
            }
        });

        // Save the pregnancy record and commit the batch
        await setDoc(pregnancyDocRef, updatedPregnancyRecordDoc, { merge: true });
        await batch.commit();
        Alert.alert('Success', 'Pregnancy record and selected piglets saved successfully.');
    } catch (error) {
        console.error('Error saving pregnancy record and piglets:', error);
        Alert.alert('Error', 'Failed to save pregnancy record and piglets. Please try again.');
    }
};


const togglePigletSelection = (pigletId) => {
  // Check if the selected piglet is assigned to the current mother
  const assignedMotherId = assignedPiglets[pigletId];

  if (assignedMotherId === pigId) {
    // If the current mother is the assigned mother, allow deselection
    setSelectedPiglets(prevSelected =>
      prevSelected.includes(pigletId)
        ? prevSelected.filter(id => id !== pigletId) // Deselect if already selected
        : [...prevSelected, pigletId] // Select if not already selected
    );
  } else {
    // Else, toggle selection only if it’s not assigned to a different mother
    setSelectedPiglets(prevSelected =>
      prevSelected.includes(pigletId)
        ? prevSelected.filter(id => id !== pigletId)
        : [...prevSelected, pigletId]
    );
  }
};


  const removePigletFromMother = async (pigletId) => {
    try {
      if (!user) return;
  
      const isMainFarm = selectedBranch === 'Main Farm';
      const pregnancyRecordsPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords`;
  
      // Fetch all pregnancy records to locate the specific mother record
      const recordsSnapshot = await getDocs(collection(firestore, pregnancyRecordsPath));
  
      let motherDocId = null;
      let updatedPiglets = [];
  
      // Find the mother document that contains the piglet to be removed
      recordsSnapshot.forEach((doc) => {
        const data = doc.data();
        const pigletIndex = (data.piglets || []).findIndex(p => p.id === pigletId);
        if (pigletIndex !== -1) {
          motherDocId = doc.id;
          updatedPiglets = [...data.piglets];
          updatedPiglets.splice(pigletIndex, 1); // Remove piglet from array
        }
      });
  
      // If a mother document was found, update the piglet list
      if (motherDocId) {
        const motherDocRef = doc(firestore, pregnancyRecordsPath, motherDocId);
        await setDoc(motherDocRef, { piglets: updatedPiglets }, { merge: true });
        Alert.alert('Success', 'Piglet successfully unassigned from its mother.');
        
        // Update assignedPiglets state to reflect removal
        setAssignedPiglets(prev => {
          const updatedAssignments = { ...prev };
          delete updatedAssignments[pigletId];
          return updatedAssignments;
        });
      } else {
        Alert.alert('Error', 'Piglet assignment not found.');
      }
    } catch (error) {
      console.error('Error removing piglet from mother:', error);
      Alert.alert('Error', 'Failed to unassign piglet. Please try again.');
    }
  };


  // Filter pigs based on the search query
  const filteredPigs = allPigs.filter(pig =>
    pig.pigName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={PigDetailsScreenStyles.container}>
      <Text style={PigDetailsScreenStyles.title}>Pig Details</Text>
      <Text style={PigDetailsScreenStyles.pigInfo}>Pig Name: {pigName}</Text>
      <Text style={PigDetailsScreenStyles.pigInfo}>Pig ID: {pigId}</Text>

      <View style={PigDetailsScreenStyles.headerContainer}>
        <Text style={PigDetailsScreenStyles.header}>All Pigs</Text>
        <TextInput
          style={PigDetailsScreenStyles.searchInput}
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredPigs}
        key={2}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          const assignedMotherName = assignedPiglets[item.id] || null;
          const isAssigned = assignedMotherName && assignedMotherName !== item.pigName;
          const buttonDisabled = isAssigned;
          const assignedMotherId = assignedPiglets[item.id] || null;
          const isAssignedToOtherMother = assignedMotherId && assignedMotherId !== pigId;

          return (
            <View style={PigDetailsScreenStyles.pigContainer}>
              <Text style={PigDetailsScreenStyles.detail}>Name: {item.pigName}</Text>
              <Text style={PigDetailsScreenStyles.detail}>Group: {item.groupName}</Text>
              <Text style={PigDetailsScreenStyles.detail}>Gender: {item.gender}</Text>
              {isAssigned && (
                <Text style={PigDetailsScreenStyles.assignedText}>
                  Assigned to mother: {assignedMotherName}
                </Text>
              )}
              <TouchableOpacity
                style={[
                  PigDetailsScreenStyles.selectButton,
                  selectedPiglets.includes(item.id) && PigDetailsScreenStyles.selectedButton,
                  buttonDisabled && PigDetailsScreenStyles.disabledButton,
                ]}
                onPress={() => togglePigletSelection(item.id)}
                disabled={buttonDisabled}
              >
                <Text style={PigDetailsScreenStyles.buttonText}>
                  {buttonDisabled
                    ? "Already Assigned"
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
