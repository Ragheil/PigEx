import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config2'; // Adjust path as needed

export default function FooterScreen({ firstName, lastName, farmName, selectedBranch, toggleSidebar, userId }) { // Added userId as prop
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  
  const [moneyInPressed, setMoneyInPressed] = useState(false);
  const [moneyOutPressed, setMoneyOutPressed] = useState(false);


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalVisible(false);
  };

  const handleMoneyIn = async () => {
    
    setMoneyInPressed(true);
    setMoneyOutPressed(false);

    setTimeout(() => {
      setMoneyInPressed(false);
    }, 300);
    try {
      let branchType;
      if (selectedBranch === 'Main Farm') {
        branchType = 'Main Farm';
      } else {
        // Fetch the farm name from Firestore for the selectedBranch
        const branchDocRef = doc(firestore, `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}`);
        const branchDoc = await getDoc(branchDocRef);
        
        if (branchDoc.exists()) {
          const branchData = branchDoc.data();
          branchType = branchData.farmName || 'Unknown Branch'; // Get the farmName field from the document
        } else {
          console.error('Error: No such branch found.');
          branchType = 'Unknown Branch';
        }
      }
  
      console.log(`Navigating to MoneyInScreen with farm branch Name: ${branchType}, selectedBranch: ${selectedBranch}, userId: ${userId}`);
  
      if (!farmName || !selectedBranch) {
        console.error('Error: farmName or selectedBranch is undefined.');
        Alert.alert('Error', 'Farm Name or Selected Branch is not set.');
        return;
      }
  
      navigation.navigate('MoneyInScreen', {
        farmName: branchType,  // Use the fetched farmName here
        selectedBranch: selectedBranch,
        userId: userId,
      });
    } catch (error) {
      console.error('Error fetching branch name:', error);
      Alert.alert('Error', 'Unable to fetch branch name.');
    }
  };
  
  
  

  const handleMoneyOut = async () => {
    setMoneyOutPressed(true);
    setMoneyInPressed(false);

    setTimeout(() => {
      setMoneyOutPressed(false);
    }, 300);

    try {
      let branchType;
      if (selectedBranch === 'Main Farm') {
        branchType = 'Main Farm';
      } else {
        // Fetch the farm name from Firestore for the selectedBranch
        const branchDocRef = doc(firestore, `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}`);
        const branchDoc = await getDoc(branchDocRef);
        
        if (branchDoc.exists()) {
          const branchData = branchDoc.data();
          branchType = branchData.farmName || 'Unknown Branch'; // Get the farmName field from the document
        } else {
          console.error('Error: No such branch found.');
          branchType = 'Unknown Branch';
        }
      }
  
      console.log(`Navigating to MoneyOutScreen with farm branch Name: ${branchType}, selectedBranch: ${selectedBranch}, userId: ${userId}`);
  
      if (!farmName || !selectedBranch) {
        console.error('Error: farmName or selectedBranch is undefined.');
        Alert.alert('Error', 'Farm Name or Selected Branch is not set.');
        return;
      }
  
      navigation.navigate('MoneyOutScreen', {
        farmName: branchType,  // Use the fetched farmName here
        selectedBranch: selectedBranch,
        userId: userId,
      });
    } catch (error) {
      console.error('Error fetching branch name:', error);
      Alert.alert('Error', 'Unable to fetch branch name.');
    }
  };
  
  const handleTransactions = async () => {
    try {
      let branchType;
      if (selectedBranch === 'Main Farm') {
        branchType = 'Main Farm';
      } else {
        // Fetch the farm name from Firestore for the selectedBranch
        const branchDocRef = doc(firestore, `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}`);
        const branchDoc = await getDoc(branchDocRef);
        
        if (branchDoc.exists()) {
          const branchData = branchDoc.data();
          branchType = branchData.farmName || 'Unknown Branch'; // Get the farmName field from the document
        } else {
          console.error('Error: No such branch found.');
          branchType = 'Unknown Branch';
        }
      }
  
      console.log(`Navigating to TransactionScreen with farm branch Name: ${branchType}, selectedBranch: ${selectedBranch}, userId: ${userId}`);
  
      if (!farmName || !selectedBranch) {
        console.error('Error: farmName or selectedBranch is undefined.');
        Alert.alert('Error', 'Farm Name or Selected Branch is not set.');
        return;
      }
  
      navigation.navigate('TransactionScreen', {
        farmName: branchType,  // Use the fetched farmName here
        selectedBranch: selectedBranch,
        userId: userId,
      });
    } catch (error) {
      console.error('Error fetching branch name:', error);
      Alert.alert('Error', 'Unable to fetch branch name.');
    }
  };

  return (
    <View>
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Dashboard')}>
          <Image source={require('../../assets/images/navigation/home.png')} style={styles.footerImage} />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate('TransactionScreen', { 
              firstName, 
              lastName, 
              farmName, 
              selectedBranch, 
              userId 
            })}
          >
            <Image source={require('../../assets/images/navigation/transaction.png')} style={styles.footerImage} />
            <Text style={styles.footerText}>Transaction</Text>
          </TouchableOpacity>


        {/* Plus button to open modal */}
        <TouchableOpacity style={styles.footerItem} onPress={toggleModal}>
          <Image source={require('../../assets/images/navigation/plus.png')} style={styles.footerImage} />
          <Text style={styles.footerText}>Money</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('ContactScreen', { firstName, lastName, farmName })}
        >
          <Image source={require('../../assets/images/navigation/contact.png')} style={styles.footerImage} />
          <Text style={styles.footerText}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={toggleSidebar}>
          <Image source={require('../../assets/images/navigation/menu.png')} style={styles.footerImage} />
          <Text style={styles.footerText}>Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Money In / Money Out */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
              <TouchableOpacity
                style={[styles.button, moneyInPressed && styles.buttonPressedMoneyIn]}
                onPress={handleMoneyIn}
                onPressIn={() => setMoneyInPressed(true)}
                onPressOut={() => setMoneyInPressed(false)}
              >
                <Text style={[styles.buttonText, moneyInPressed && styles.textPressedMoneyIn]}>Money In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, moneyOutPressed && styles.buttonPressedMoneyOut]}
                onPress={handleMoneyOut}
                onPressIn={() => setMoneyOutPressed(true)}
                onPressOut={() => setMoneyOutPressed(false)}
              >
                <Text style={[styles.buttonText, moneyOutPressed && styles.textPressedMoneyOut]}>Money Out</Text>
              </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    zIndex: 2,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerImage: {
    width: 24,
    height: 24,
  },
  footerText: {
    fontSize: 12,
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', // dim background
  },
  modalContent: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#ddd',
    margin: 5,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPressedMoneyIn: {
    backgroundColor: '#DCFFB7', // Color when button is pressed
  },
  buttonPressedMoneyOut: {
    backgroundColor: '#F28585', // Color when button is pressed
  },
  textPressedMoneyIn: {
    color: '#6e7f5b',
    fontWeight: 'bold',
  },
  textPressedMoneyOut: {
    color: '#794242',
    fontWeight: 'bold',
  },
});
