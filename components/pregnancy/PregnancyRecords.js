import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Image,TextInput } from 'react-native';
import { firestore } from '../../firebase/config2';
import { collection, getDocs, doc, getDoc,updateDoc,setDoc,addDoc } from 'firebase/firestore';
import viewIcon from '../../assets/images/buttons/viewIcon.png';
import PregnancyRecordsStyles from '../../frontend/Pregnancy/PregnancyRecordsStyles';

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
      alert('Please enter a breeding date.');
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
        addedAt: new Date(),
      });
      alert('Breeding date added successfully');
      setModalVisible(false); // Close modal
    } catch (error) {
      console.error('Error adding breeding date: ', error);
      alert('Failed to add breeding date');
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
            {modalType === 'piglets' ? (
              <>
                <Text style={PregnancyRecordsStyles.modalTitle}>Piglets of {selectedPigName}</Text>
                {selectedPiglets.length > 0 ? (
                  <FlatList
                    data={selectedPiglets}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      <Text style={PregnancyRecordsStyles.pigletName}>{item.pigName}</Text>
                    )}
                  />
                ) : (
                  <Text style={PregnancyRecordsStyles.noPigletsText}>No piglets found for this pig.</Text>
                )}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={PregnancyRecordsStyles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : modalType === 'breeding' ? (
              <>
                <Text style={PregnancyRecordsStyles.modalTitle}>Add Breeding Date</Text>
                <TextInput
                  style={PregnancyRecordsStyles.inputField}
                  placeholder="Enter Breeding Date"
                  value={breedingDate}
                  onChangeText={setBreedingDate}
                />
                <TouchableOpacity onPress={addBreedingDate}>
                  <Text style={PregnancyRecordsStyles.submitButton}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={PregnancyRecordsStyles.closeModalText}>Close</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PregnancyRecords;
