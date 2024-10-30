import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs } from 'firebase/firestore';

const PregnancyRecords = ({ route }) => {
  // Destructure the parameters passed from the previous screen
  const { selectedBranch, user } = route.params || {};

  // Check if required parameters are missing
  if (!selectedBranch || !user) {
    return <Text>Error: Missing branch or user information.</Text>; // Show error message
  }

  const [femalePigs, setFemalePigs] = useState({ sortedGroups: [], groupedPigs: {} }); // State to store female pigs
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  // Function to fetch female pigs from Firestore
  const fetchFemalePigs = async () => {
    setLoading(true); // Show loading indicator
    try {
      // Determine the branch path based on whether it's the main farm
      const isMainFarm = selectedBranch === 'Main Farm';
      const branchPath = isMainFarm
        ? `users/${user.uid}/farmBranches/Main Farm/pigGroups`
        : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pigGroups`;

      // Fetch pig groups from Firestore
      const groupsSnapshot = await getDocs(collection(firestore, branchPath));

      // Fetch female pigs for each group
      const femalePigsPromises = groupsSnapshot.docs.map(async (groupDoc) => {
        const pigsPath = `${branchPath}/${groupDoc.id}/pigs`;
        const pigsSnapshot = await getDocs(collection(firestore, pigsPath));
        const femalePigs = pigsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data(), groupName: groupDoc.data().name }))
          .filter(pig => pig.gender === 'female');
        return femalePigs; // Return the array of female pigs
      });

      // Await all promises and flatten the results
      const femalePigsArrays = await Promise.all(femalePigsPromises);
      const allFemalePigs = femalePigsArrays.flat(); // Update state with all female pigs

      // Group and sort female pigs by their group names
      const groupedPigs = {};
      allFemalePigs.forEach(pig => {
        if (!groupedPigs[pig.groupName]) {
          groupedPigs[pig.groupName] = [];
        }
        groupedPigs[pig.groupName].push(pig);
      });

      // Sort the groups
      const sortedGroups = Object.keys(groupedPigs).sort();

      setFemalePigs({ sortedGroups, groupedPigs }); // Update state with grouped and sorted pigs
    } catch (error) {
      console.error("Error fetching female pigs: ", error); // Log any errors
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Effect to fetch female pigs whenever the selected branch changes
  useEffect(() => {
    fetchFemalePigs();
  }, [selectedBranch, user]);

  // Show loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Render the list of female pigs grouped by their group names
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pregnancy Records</Text>
      {femalePigs.sortedGroups.length === 0 ? ( // Check if there are no groups
        <Text>No female pigs found.</Text>
      ) : (
        femalePigs.sortedGroups.map(group => (
          <View key={group}>
            <Text style={styles.groupName}>{group}</Text>
            {femalePigs.groupedPigs[group].map(pig => ( // Ensure groupedPigs[group] exists
              <Text key={pig.id} style={styles.pigName}>{pig.pigName}</Text> // Display each pig's name
            ))}
          </View>
        ))
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  groupName: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  pigName: { paddingLeft: 10, fontSize: 16, marginBottom: 5 },
});

export default PregnancyRecords; // Export the component
