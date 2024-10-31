import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, setDoc, writeBatch, getDoc } from 'firebase/firestore';

const PigDetailsScreen = ({ route }) => {
  const { selectedBranch, user, pigId, pigName } = route.params; // Retrieve pigId and pigName from navigation params
  const [allPigs, setAllPigs] = useState([]); // State to store all pigs in the selected branch
  const [loading, setLoading] = useState(true); // Loading indicator
  const [selectedPiglets, setSelectedPiglets] = useState([]); // State to store selected piglets
  const [assignedPiglets, setAssignedPiglets] = useState({}); // Store piglets assigned to a mother

  // Fetch all pigs in the selected branch
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

  // Fetch assigned piglets to check if they’re already associated with another mother
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
        const motherName = motherData.pigName || 'Unnamed Mother'; // Use a default name if not provided
        const piglets = motherData.piglets || [];
        
        piglets.forEach(piglet => {
          pigletsAssignments[piglet.id] = motherName; // Store mother's name instead of ID
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

      // Fetch existing pregnancy record to preserve piglets
      const pregnancyDocRef = doc(firestore, pregnancyRecordPath);
      const existingRecordSnapshot = await getDoc(pregnancyDocRef);
      const existingRecord = existingRecordSnapshot.exists() ? existingRecordSnapshot.data() : null;

      // If no existing record, alert and exit
      if (!existingRecord) {
        Alert.alert('Error', 'No existing pregnancy record found for this pig.');
        return;
      }

      // Update the pregnancy record while keeping the existing piglets
      const updatedPregnancyRecordDoc = {
        pigName: pigName || 'Unnamed Pig',
        id: pigId,
        date: new Date().toISOString(),
        piglets: existingRecord.piglets || [] // Keep existing piglets
      };

      // Add the selected piglets if they are not already included
      selectedPiglets.forEach(id => {
        if (!updatedPregnancyRecordDoc.piglets.find(p => p.id === id)) {
          updatedPregnancyRecordDoc.piglets.push({ id, name: allPigs.find(p => p.id === id).pigName });
        }
      });

      await setDoc(pregnancyDocRef, updatedPregnancyRecordDoc, { merge: true });
      Alert.alert('Success', 'Pregnancy record and selected piglets saved successfully.');
    } catch (error) {
      console.error('Error saving pregnancy record and piglets:', error);
      Alert.alert('Error', 'Failed to save pregnancy record and piglets. Please try again.');
    }
  };

  const togglePigletSelection = (pigId) => {
    setSelectedPiglets(prevSelected =>
      prevSelected.includes(pigId)
        ? prevSelected.filter(id => id !== pigId)
        : [...prevSelected, pigId]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pig Details</Text>
      <Text style={styles.pigInfo}>Pig Name: {pigName}</Text>
      <Text style={styles.pigInfo}>Pig ID: {pigId}</Text>

      <Text style={styles.header}>All Pigs</Text>
      <FlatList
        data={allPigs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          // Retrieve the mother name instead of ID
          const assignedMotherName = assignedPiglets[item.id] || null; // Default to null if not assigned
          const isAssigned = assignedMotherName && assignedMotherName !== item.pigName; // Check if it’s assigned and not to itself
          const buttonDisabled = isAssigned; // Disable the button if already assigned
          
          return (
            <View style={styles.pigContainer}>
              <Text style={styles.detail}>Name: {item.pigName}</Text>
              <Text style={styles.detail}>Group: {item.groupName}</Text>
              <Text style={styles.detail}>ID: {item.id}</Text>
              <Text style={styles.detail}>Gender: {item.gender}</Text>
              {isAssigned && (
                <Text style={styles.assignedText}>Assigned to mother: {assignedMotherName}</Text>
              )}
              <TouchableOpacity
                style={[styles.selectButton, selectedPiglets.includes(item.id) && styles.selectedButton, buttonDisabled && styles.disabledButton]}
                onPress={() => togglePigletSelection(item.id)}
                disabled={buttonDisabled}
              >
                <Text style={styles.buttonText}>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  pigInfo: { fontSize: 18, marginBottom: 8 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  pigContainer: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  detail: { fontSize: 16, marginBottom: 5 },
  selectButton: { padding: 10, borderRadius: 5, backgroundColor: '#ddd', alignItems: 'center', marginTop: 10 },
  selectedButton: { backgroundColor: '#4CAF50' },
  disabledButton: { backgroundColor: '#999' },
  assignedText: { fontSize: 14, color: 'red' },
  buttonText: { color: '#fff' },
});

export default PigDetailsScreen;
