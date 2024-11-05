import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { collection, query, onSnapshot, updateDoc, doc, setDoc, getDoc, getDocs, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase/config2';
import FooterScreen from './footer/FooterScreen';
import { Picker } from '@react-native-picker/picker';
import styles from '../frontend/componentsStyles/DashboardScreenStyles';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';

export default function DashboardScreen({ firstName, lastName, farmName, onLogout }) {
  // State variables
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [pigGroups, setPigGroups] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [updatedFirstName, setUpdatedFirstName] = useState(firstName);
  const [updatedLastName, setUpdatedLastName] = useState(lastName);
  const [updatedFarmName, setUpdatedFarmName] = useState(farmName);
  const [currentFirstName, setCurrentFirstName] = useState(firstName);
  const [currentLastName, setCurrentLastName] = useState(lastName);
  const [currentFarmName, setCurrentFarmName] = useState(farmName);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(farmName);
  const sidebarTranslateX = useState(new Animated.Value(Dimensions.get('window').width))[0];
  const navigation = useNavigation();
  const [updatedEmail, setUpdatedEmail] = useState(auth.currentUser?.email || ''); // New state for email address
  const [currentPassword, setCurrentPassword] = useState('');
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const user = auth.currentUser;
  
 // const userId = user ? user.uid : null; // Ensure that userId is defined
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
        setUserId(user.uid);
        fetchUserDetails(user.uid);
    }
}, []);


useEffect(() => {
  if (user) {
    const userId = user.uid; 
    const userDocRef = doc(firestore, `users/${userId}/farmBranches/Main Farm`);

    const unsubscribeUserDoc = onSnapshot(userDocRef, (doc) => {
      const userData = doc.data();
      const farmName = userData?.farmName || ''; 
      setCurrentFarmName(`${farmName}`); 
      // Setting the selected branch to reflect the Main Farm's name
      setSelectedBranch(`Main Farm: ${farmName}`); 

      const q = query(collection(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches`));
      const unsubscribeFarmBranches = onSnapshot(q, (snapshot) => {
        const branchList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          branchList.push({ id: doc.id, ...data });
        });

        console.log("Fetched branches:", branchList); // Debug log
        const updatedBranchList = branchList.map(branch => ({
          id: branch.id,
          name: branch.id === 'Main Farm' ? `Main Farm: ${farmName}` : `Farm Branch: ${branch.farmName || 'Unnamed Branch'}`,
        }));
        
        // Adding the Main Farm explicitly to the list if it's not already included
        if (!branchList.some(branch => branch.id === 'Main Farm')) {
          updatedBranchList.unshift({
            id: 'Main Farm',
            name: `Main Farm: ${farmName}`,
          });
        }

        setBranches(updatedBranchList);
      });

      return () => {
        unsubscribeFarmBranches();
        unsubscribeUserDoc();
      };
    });
  }
}, [user]);

const handleSeeAllBranches = () => {
  navigation.navigate('SeeAllBranches'); // Navigate to the new screen
};

const getUserDetailsFromFirestore = async (uid) => {
  try {
    const userDocRef = doc(firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error; // re-throw the error to handle it later if needed
  }
};

  
  useEffect(() => {
    setCurrentFirstName(updatedFirstName);
    setCurrentLastName(updatedLastName);
    setCurrentFarmName(updatedFarmName);
  }, [updatedFirstName, updatedLastName, updatedFarmName]);

  const toggleSidebar = () => {
    Animated.timing(sidebarTranslateX, {
      toValue: sidebarVisible ? Dimensions.get('window').width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const fetchUserDetails = async (uid) => {
    try {
      const userDocRef = doc(firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        console.log("Farm data fetched from Firestore:", userDoc.data()); // Log fetched farm data
        return userDoc.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error; // re-throw the error to handle it later if needed
    }
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(firestore, `users/${userId}/farmBranches/Main Farm`);

      const unsubscribeUserDoc = onSnapshot(userDocRef, (doc) => {
        const userData = doc.data();
        const farmName = userData?.farmName || 'Main Farm';
        setCurrentFarmName(farmName);
        setSelectedBranch('Main Farm');  // Set the branch to "Main Farm" on login

        const q = query(collection(firestore, `users/${userId}/farmBranches/Farm Branch/Branches`));
        const unsubscribeFarmBranches = onSnapshot(q, (snapshot) => {
          const branchList = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            branchList.push({ id: doc.id, ...data });
          });

          const updatedBranchList = branchList.map(branch => ({
            id: branch.id,
            name: branch.id === 'Main Farm' ? `Main Farm: ${farmName}` : `Farm Branch: ${branch.farmName || 'Unnamed Branch'}`,
          }));
          
          // Include Main Farm in the list if not present
          if (!branchList.some(branch => branch.id === 'Main Farm')) {
            updatedBranchList.unshift({
              id: 'Main Farm',
              name: `Main Farm: ${farmName}`,
            });
          }

          setBranches(updatedBranchList);
        });

        return () => {
          unsubscribeFarmBranches();
          unsubscribeUserDoc();
        };
      });
    }
  }, [user]);

  const closeSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(sidebarTranslateX, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setSidebarVisible(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Do you want to logout?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: onLogout },
      ],
      { cancelable: true }
    );
  };


  const updateUserEmail = async () => {
    try {
      // Attempt to update the email
      await updateEmail(user, updatedEmail);
      Alert.alert("Success", "Email updated successfully! Please login again to complete the changes.");

      setEmailModalVisible(false);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        // Custom message for the 'requires-recent-login' error
        Alert.alert(
          "Login again",
          "You need to log in with your current email and try this process again."
        );
      } else {
        // General error handling for other errors
        console.error('Error updating email:', error.message);
        Alert.alert("Error updating email", error.message);
      }
    }
  };
  

  const handleUpdate = async () => {
    if (user) {
      const mainBranchDoc = doc(firestore, `users/${user.uid}/farmBranches/Main Farm`);

      try {
        // Update user details
        await updateDoc(doc(firestore, `users/${user.uid}`), {
          firstName: updatedFirstName,
          lastName: updatedLastName,
        });

        // Update farm name if it's different from current
        if (currentFarmName !== updatedFarmName) {
          await updateDoc(mainBranchDoc, { farmName: updatedFarmName });
          setCurrentFarmName(updatedFarmName);
        }

        setModalVisible(false);
      } catch (error) {
        console.error('Error updating account:', error);
      }
    }
  };


const handleBranchSwitch = (branchName) => {
  const selectedBranchObj = branches.find(branch => branch.id === branchName);

  if (branchName !== selectedBranch) {
      Alert.alert(
          "Switch Branch",
          `Do you want to switch to the ${selectedBranchObj?.name || branchName} branch?`,
          [
              { text: "Cancel", style: "cancel" },
              {
                  text: "Yes",
                  onPress: () => {
                      setSelectedBranch(branchName);
                      setCurrentFarmName(selectedBranchObj?.name || branchName);
                      console.log(`Switched to ${selectedBranchObj?.name || branchName} branch.`);
                  },
              },
          ],
          { cancelable: true }
      );
  }
};

  


const handleAddBranch = async () => {
  if (!newBranchName.trim()) {
    Alert.alert('Validation Error', 'Branch name is required!');
    return;
  }

  try {
    if (user) {
      // Reference to the 'Branches' collection
      const branchesCollectionRef = collection(firestore, `users/${user.uid}/farmBranches/Farm Branch/Branches`);
      const branchSnapshot = await getDocs(branchesCollectionRef);
      
      // Check if a branch with this name already exists
      const branchExists = branchSnapshot.docs.some(doc => doc.id === newBranchName);
      if (branchExists) {
        Alert.alert('Branch Error', 'A branch with this name already exists!');
        return;
      }

      // Add a new branch with a unique ID but with the 'newBranchName' field
      const newBranchRef = await addDoc(branchesCollectionRef, { farmName: newBranchName });
      
      // Optionally, update the document ID to match the newBranchName
      await setDoc(doc(branchesCollectionRef, newBranchRef.id), { farmName: newBranchName });

      // Reset input and close modal
      setNewBranchName('');
      setBranchModalVisible(false);
      console.log('New branch added:', newBranchName);
    }
  } catch (error) {
    console.error('Error adding branch:', error);
  } 
};




  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FDE9EA', '#869F77', '#588061']}
        style={styles.gradient}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Pig Groups Summary</Text>

          <TouchableOpacity
  style={[styles.seeAllButton, { zIndex: 10, elevation: 5 }]}
  onPress={() => navigation.navigate('PigGroups', {
    selectedBranch: selectedBranch === `Main Farm: ${farmName}` ? 'Main Farm' : selectedBranch,
    farmName: farmName // Pass the farm name here
  })}
>
  <Text style={styles.seeAllText}>See All</Text>
</TouchableOpacity>


          <FlatList
                    data={pigGroups}
                    renderItem={({ item }) => (
                        <View style={styles.pigGroupSummary}>
                            <Text style={styles.pigGroupText}>{item.name}</Text>
                            <Text style={styles.pigCountText}>
                                <Text style={styles.boldText}>{/* {item.pigCount || 0} Pigs */}</Text>
                            </Text>
                        </View>
                    )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            snapToAlignment="center"
            snapToInterval={160}
            decelerationRate="fast"
            ListEmptyComponent={<Text>No pig groups available.</Text>}
            style={styles.flatList}
          />
        </View>

        <FooterScreen 
  firstName={firstName} 
  lastName={lastName} 
  farmName={farmName} 
  selectedBranch={selectedBranch} 
  toggleSidebar={toggleSidebar} 
  userId={userId} 
/>




        <TouchableWithoutFeedback onPress={closeSidebar}>
          <Animated.View style={[styles.sidebarOverlay, { opacity: sidebarVisible ? 0.5 : 0 }]} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarTranslateX }] }]}>
          <View style={styles.sidebarHeaderContainer}>
            <Text style={styles.sidebarHeader}>{currentFirstName} {currentLastName}</Text>
            <TouchableOpacity style={styles.accountButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.accountButtonText}>Account</Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.sidebarDivider} />
          <Text style={styles.sidebarText}> Farm: <Text style={{ fontWeight: 'bold' }}>{currentFarmName}</Text> </Text>

          {/* Branch Picker */}
          <Picker
    selectedValue={selectedBranch}
    onValueChange={handleBranchSwitch}
    style={styles.picker}
>
    <Picker.Item label="Select a Branch" value="" />
    {branches.map((branch) => (
        <Picker.Item
            key={branch.id}
            label={branch.name}
            value={branch.id}
        />
    ))}
</Picker>



          <TouchableOpacity style={styles.addBranchButton} onPress={() => setBranchModalVisible(true)}>
            <Text style={styles.addBranchText}>Add Branch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.seeAllButton, { zIndex: 10, elevation: 5 }]}
            onPress={handleSeeAllBranches} // New button functionality
          >
            <Text style={styles.seeAllText}>Manage Farm Branches</Text>
          </TouchableOpacity>


          <TouchableOpacity
  style={[styles.seeAllButton, { zIndex: 10, elevation: 5 }]}
  onPress={() => {
    console.log("Navigating to PregnancyRecords with:", { selectedBranch, user });
    navigation.navigate('PregnancyRecords', { selectedBranch, user });
  }}
>
  <Text style={styles.seeAllText}>Pregnancy Records</Text>
</TouchableOpacity>




          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Account Modal */}
   {/* Account Update Modal */}
   <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Account</Text>
            <TextInput
              value={updatedFirstName}
              onChangeText={setUpdatedFirstName}
              placeholder="First Name"
              style={styles.input}
            />
            <TextInput
              value={updatedLastName}
              onChangeText={setUpdatedLastName}
              placeholder="Last Name"
              style={styles.input}
            />
            <TextInput
              value={updatedFarmName}
              onChangeText={setUpdatedFarmName}
              placeholder="Farm Name"
              style={styles.input}
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>

            {/* Button to open the email update modal */}
            <TouchableOpacity style={styles.updateButton} onPress={() => setEmailModalVisible(true)}>
              <Text style={styles.updateButtonText}>Update Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Email Update Modal */}
      <Modal
        visible={emailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEmailModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Email</Text>
              <TextInput
                style={styles.input}
                placeholder="New Email"
                value={updatedEmail}
                onChangeText={setUpdatedEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={updateUserEmail}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setEmailModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

        {/* Add Branch Modal */}
        <Modal visible={branchModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Branch</Text>
              <TextInput
                value={newBranchName}
                onChangeText={setNewBranchName}
                placeholder="Branch Name"
                style={styles.input}
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleAddBranch}>
                <Text style={styles.addButtonText}>Add Branch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setBranchModalVisible(false)}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}
