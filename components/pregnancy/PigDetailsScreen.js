import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs } from 'firebase/firestore';

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

        const groupPigs = pigsSnapshot.docs.map(doc => ({
          id: doc.id,
          pigName: doc.data().name, // Retrieve the pig's name
          ...doc.data(),
          groupName, // Include the pig's group name
          motherId: doc.data().motherId || null, // Retrieve mother ID if exists
          motherName: doc.data().motherName || null, // Retrieve mother name if exists
          motherPigGroup: doc.data().motherPigGroup || null, // Retrieve mother pig group if exists
        }));
        pigsList = [...pigsList, ...groupPigs]; // Append each pig to the list
      }
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

  // Save selected piglets or handle further actions
  const handleSavePiglets = () => {
    console.log("Selected piglets: ", selectedPiglets);
    // Add your logic to save or handle selected piglets
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
            <Text style={styles.detail}>Birth Date: {item.birthDate}</Text>
            
            {item.motherId && (
              <View style={styles.motherDetails}>
                <Text style={styles.motherDetail}>Mother ID: {item.motherId}</Text>
                <Text style={styles.motherDetail}>Mother Name: {item.motherName}</Text>
                <Text style={styles.motherDetail}>Mother Pig Group: {item.motherPigGroup}</Text>
              </View>
            )}
            
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
      <Button title="Save Selected Piglets" onPress={handleSavePiglets} />
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
  motherDetails: { marginTop: 10, paddingLeft: 10, borderTopWidth: 1, borderColor: '#ccc' },
  motherDetail: { fontSize: 16, color: '#666' },
  selectButton: { padding: 10, borderRadius: 5, backgroundColor: '#ddd', alignItems: 'center', marginTop: 10 },
  selectedButton: { backgroundColor: '#4CAF50' },
  buttonText: { color: '#fff' },
});

export default PigDetailsScreen;
