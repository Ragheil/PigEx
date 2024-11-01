import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PregnancyRecordsScreen = ({ route }) => {
  const { pigId, pigName, selectedBranch, user } = route.params; // Destructure all params
  const [pregnancyRecords, setPregnancyRecords] = useState([]);
  const [piglets, setPiglets] = useState([]);

  useEffect(() => {
    if (!pigId || !user || !user.uid) {
      console.error('Missing pigId or user uid.'); // Log an error if uid is missing
      return;
    }

    const fetchPregnancyRecords = async () => {
      try {
        const motherRecordsPath = selectedBranch === 'Main Farm'
          ? `users/${user.uid}/farmBranches/Main Farm/pregnancyRecords/${pigId}/motherRecords`
          : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/pregnancyRecords/${pigId}/motherRecords`;

        const recordsSnapshot = await firestore().collection(motherRecordsPath).get();
        const records = recordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPregnancyRecords(records);
      } catch (error) {
        console.error('Error fetching pregnancy records: ', error);
      }
    };

    const fetchPiglets = async () => {
      try {
        const pigletsPath = selectedBranch === 'Main Farm'
          ? `users/${user.uid}/farmBranches/Main Farm/piglets/${pigId}`
          : `users/${user.uid}/farmBranches/Farm Branch/Branches/${selectedBranch}/piglets/${pigId}`;

        const pigletSnapshot = await firestore().collection(pigletsPath).get();
        const pigletData = pigletSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPiglets(pigletData);
      } catch (error) {
        console.error('Error fetching piglets: ', error);
      }
    };

    fetchPregnancyRecords();
    fetchPiglets();
  }, [pigId, selectedBranch, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pregnancy Records for {pigName}</Text>
      {/* Render FlatList for pregnancy records and piglets */}
    </View>
  );
};

export default PregnancyRecordsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
