import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const PigDetailsScreen = ({ route }) => {
  const { pigId, pigName, selectedBranch, user } = route.params; // Destructure parameters passed from the previous screen

  // Check if required parameters are missing
  if (!user) {
    return <Text>Error: User information is missing.</Text>; // Show error message
  }

  const [pigDetails, setPigDetails] = useState(null); // State to store pig details
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  // Function to fetch pig details from Firestore
  const fetchPigDetails = async () => {
    setLoading(true); // Show loading indicator
    try {
      // Determine the branch path based on whether it's the main farm
      const isMainFarm = selectedBranch === 'Main Farm';
      const branchPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

      // Fetch pig groups
      const groupsSnapshot = await getDocs(collection(firestore, branchPath));
      let foundPig = null;

      // Check each group for the pigId
      for (const groupDoc of groupsSnapshot.docs) {
        const pigsPath = `${branchPath}/${groupDoc.id}/pigs/${pigId}`;
        const pigDoc = await getDoc(doc(firestore, pigsPath));

        if (pigDoc.exists()) {
          foundPig = { id: pigDoc.id, ...pigDoc.data(), groupName: groupDoc.data().name }; // Store pig details in state
          break; // Exit the loop once the pig is found
        }
      }

      if (foundPig) {
        setPigDetails(foundPig); // Update state if pig is found
      } else {
        console.log('No such pig found in any group!'); // Log if no pig was found
      }
    } catch (error) {
      console.error("Error fetching pig details: ", error); // Log any errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Effect to fetch pig details when the component mounts
  useEffect(() => {
    fetchPigDetails();
  }, [pigId, selectedBranch, user]);

  // Show loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Show error if pig details are not found
  if (!pigDetails) {
    return <Text>Error: Pig details not found.</Text>;
  }

  // Render pig details
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pig Details</Text>
      <Text style={styles.detail}>Name: {pigName}</Text> 
      <Text style={styles.detail}>ID: {pigId}</Text> 
      <Text style={styles.detail}>Gender: {pigDetails.gender}</Text>
      <Text style={styles.detail}>Birth Date: {pigDetails.birthDate}</Text>
      <Text style={styles.detail}>Group: {pigDetails.groupName}</Text>
      {/* Add more pig details as needed */}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  detail: { fontSize: 18, marginBottom: 10 },
});

export default PigDetailsScreen; // Export the component
