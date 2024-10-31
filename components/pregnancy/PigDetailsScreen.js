import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const PigDetailsScreen = ({ route }) => {
  const { selectedBranch, user, pigId, pigName } = route.params; // Retrieve pigId and pigName from navigation params
  const [allPigs, setAllPigs] = useState([]); // State to store all pigs in the selected branch
  const [loading, setLoading] = useState(true); // Loading indicator
  const [selectedPiglets, setSelectedPiglets] = useState([]); // State to store selected piglets

  // Function to fetch all pigs in the selected branch
  const fetchAllPigs = async () => {
    setLoading(true);
    try {
      const isMainFarm = selectedBranch === 'Main Farm';
      const branchPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

      // Fetch pig groups
      const groupsSnapshot = await getDocs(collection(firestore, branchPath));
      let pigsList = [];

      // Retrieve all pigs from each group
      for (const groupDoc of groupsSnapshot.docs) {
        const groupName = groupDoc.data().name; // Get the group name
        const pigsPath = `${branchPath}/${groupDoc.id}/pigs`;
        const pigsSnapshot = await getDocs(collection(firestore, pigsPath));

        // Log pig data for debugging
        pigsSnapshot.docs.forEach(doc => {
          console.log(doc.data());
        });

        const groupPigs = pigsSnapshot.docs.map(doc => ({
          id: doc.id,
          pigName: doc.data().pigName, // Ensure this matches the Firestore field name
          gender: doc.data().gender,
          groupName, // Include the pig's group name
        }));
        
        pigsList = [...pigsList, ...groupPigs]; // Append each pig to the list
      }
      console.log('Pigs List:', pigsList); // Log the pigs list before setting state
      setAllPigs(pigsList); // Update state with all pigs
    } catch (error) {
      console.error("Error fetching pigs: ", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    fetchAllPigs();
  }, [selectedBranch, user]);

  // Save selected pigs in a Firestore document for each selected piglet
  const saveSelectedPigs = async () => {
    try {
      if (!user) return;

      // Log the selected piglets and all pigs for debugging
      console.log('Selected Piglets:', selectedPiglets);
      console.log('All Pigs:', allPigs);

      // Determine the correct path based on the selected branch
      const path = selectedBranch === 'Main Farm'
        ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords`;

      // Ensure there's data to save
      if (selectedPiglets.length === 0) {
        Alert.alert('Error', 'No valid piglets selected. Please select at least one piglet.');
        return;
      }

      // Save each selected piglet as a separate document
      await Promise.all(selectedPiglets.map(async (pigId) => {
        const pig = allPigs.find(p => p.id === pigId);

        if (pig) {
          const pregnancyRecordDoc = {
            name: pig.pigName || 'Unnamed Pig', // Provide a default value if pigName is undefined
            id: pig.id,
            groupName: pig.groupName,
            gender: pig.gender,
          };

          // Log the document data before saving
          console.log('Document Data:', pregnancyRecordDoc);

          // Check for undefined values before saving
          for (const key in pregnancyRecordDoc) {
            if (pregnancyRecordDoc[key] === undefined) {
              console.error(`Field "${key}" is undefined for pigId: ${pigId}`);
              return; // Exit early if any field is undefined
            }
          }

          // Create a unique document for each selected piglet using its ID
          const docRef = doc(firestore, path, pig.id); // Use pig ID for the document ID
          await setDoc(docRef, pregnancyRecordDoc, { merge: true }); // Merge with existing document or create a new one
        }
      }));

      console.log('Selected pigs saved successfully');
      Alert.alert('Success', 'Selected pigs saved successfully.'); // Inform the user of success
    } catch (error) {
      console.error('Error saving selected pigs:', error);
      Alert.alert('Error', 'Failed to save selected pigs. Please try again.');
    }
  };

  // Toggle piglet selection
  const togglePigletSelection = (pigId) => {
    setSelectedPiglets(prevSelected => {
      if (prevSelected.includes(pigId)) {
        return prevSelected.filter(id => id !== pigId);
      } else {
        return [...prevSelected, pigId];
      }
    });
  };

  // Handle save selected piglets
  const handleSavePiglets = () => {
    saveSelectedPigs(); // Call the function to save selected piglets
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {/* Display the selected pig's name and ID */}
      <Text style={styles.title}>Pig Details</Text>
      <Text style={styles.pigInfo}>Pig Name: {pigName}</Text>
      <Text style={styles.pigInfo}>Pig ID: {pigId}</Text>

      <Text style={styles.header}>All Pigs</Text>
      <FlatList
        data={allPigs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.pigContainer}>
            <Text style={styles.detail}>Name: {item.pigName}</Text>
            <Text style={styles.detail}>Group: {item.groupName}</Text>
            <Text style={styles.detail}>ID: {item.id}</Text>
            <Text style={styles.detail}>Gender: {item.gender}</Text>

            <TouchableOpacity
              style={[
                styles.selectButton,
                selectedPiglets.includes(item.id) && styles.selectedButton,
              ]}
              onPress={() => togglePigletSelection(item.id)}
            >
              <Text style={styles.buttonText}>
                {selectedPiglets.includes(item.id) ? "Deselect Piglet" : "Select as Piglet"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Save Selected Pigs"
        onPress={handleSavePiglets} // Call the function to save selected piglets
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
  buttonText: { color: '#fff', fontSize: 16 },
});

export default PigDetailsScreen;
