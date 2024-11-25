import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Modal, Image } from 'react-native';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, onSnapshot  } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/config2'; // Adjust the path as needed
import { Swipeable } from 'react-native-gesture-handler';
import styles from '../../frontend/contactStyle/ContactScreenStyles'; // Importing the separated styles
import NetInfo from "@react-native-community/netinfo";
import { getFirestore, enablePersistence } from "firebase/firestore";


const ContactScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [editContactId, setEditContactId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log("You are online");
        fetchContacts(); // Fetch contacts when online
      } else {
        console.log("You are offline");
        // Handle offline state, e.g., show a message to the user
      }
    });
  
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    const results = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.contactNumber.includes(searchQuery)
    );
    setFilteredContacts(results);
  }, [searchQuery, contacts]);

  const fetchContacts = async () => {
    try {
      if (!user) return;
      const userContactsCollection = collection(firestore, `users/${user.uid}/contacts`);
      const q = query(userContactsCollection, orderBy('name'));
  
      // Listen for real-time updates
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const contactsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(contactsList);
      });
  
      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const addOrUpdateContact = async () => {
    if (!name || !address || !contactNumber) {
        Alert.alert('Validation Error', 'All fields are required!');
        return;
    }

    if (contactNumber.length !== 11) {
        Alert.alert('Validation Error', 'Contact number must be 11 digits long.');
        return;
    }

    try {
        if (!user) return;

        // Fetch existing contacts
        const userContactsCollection = collection(firestore, `users/${user.uid}/contacts`);
        const contactsSnapshot = await getDocs(userContactsCollection);
        const existingContacts = contactsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Check for duplicates
        const isDuplicateNumber = existingContacts.some(contact => contact.contactNumber === contactNumber && contact.id !== editContactId);
        const isDuplicateName = existingContacts.some(contact => contact.name.toLowerCase() === name.toLowerCase() && contact.id !== editContactId);

        if (isDuplicateNumber) {
            Alert.alert('Duplicate Error', 'This contact number already exists.');
            return;
        }

        if (isDuplicateName) {
            Alert.alert('Duplicate Error', 'This contact name already exists.');
            return;
        }

        setLoading(true); 123

        if (editContactId) {
            // Update existing contact
            await updateDoc(doc(firestore, `users/${user.uid}/contacts`, editContactId), {
                name,
                address,
                contactNumber,
            });
            setEditContactId(null);
        } else {
            // Add new contact
            await addDoc(collection(firestore, `users/${user.uid}/contacts`), {
                name,
                address,
                contactNumber,
            });
        }

        // Clear the input fields
        setName('');
        setAddress('');
        setContactNumber('');

        // Close the modal immediately after the operation
        setModalVisible(false);

        // Fetch the updated contacts
        fetchContacts();
    } catch (error) {
        console.error('Error adding/updating contact:', error);
    } finally {
        setLoading(false); 
    }
};

  const confirmDeleteContact = (contactId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteContact(contactId) },
      ],
      { cancelable: false }
    );
  };

  const deleteContact = async (contactId) => {
    try {
      if (!user) return;
      await deleteDoc(doc(firestore, `users/${user.uid}/contacts`, contactId));
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handlePhoneCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const startEditContact = (contact) => {
    setName(contact.name);
    setAddress(contact.address);
    setContactNumber(contact.contactNumber);
    setEditContactId(contact.id);
    setModalVisible(true);
    setViewModalVisible(false);
  };

  const openAddContactModal = () => {
    setName('');
    setAddress('');
    setContactNumber('');
    setEditContactId(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openViewModal = (contact) => {
    setSelectedContact(contact);
    setViewModalVisible(true);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
    setSelectedContact(null);
  };

  const renderRightActions = (contactId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => confirmDeleteContact(contactId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Contacts</Text>

      <View style={styles.headerContainer}>
        <Button title="Add Contact" onPress={openAddContactModal} color="#566F48"/>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or number"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.tableHeader}>Contacts</Text>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <TouchableOpacity onPress={() => openViewModal(item)}>
              <View style={styles.contactItem}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactNumber}>{item.contactNumber}</Text>
                  <Text style={styles.contactName}>{item.name}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handlePhoneCall(item.contactNumber)}>
                    <Image
                      source={require('../../assets/images/contacts/contactIcon.png')}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>

      {/* Modal for confirming deletion 


                  <TouchableOpacity onPress={() => confirmDeleteContact(item.id)}>
                    <Image
                      source={require('../assets/contacts/deleteIcon.png')}
                      style={styles.actionIcon}
                    />
                  </TouchableOpacity>
                  */}
                  
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      {/* Modal for adding or editing a contact */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.header}>{editContactId ? 'Edit Contact Information' : 'Add New Contact'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={closeModal} color="#F44336" />
              <Button title="Save" onPress={addOrUpdateContact} color="#4CAF50" disabled={loading} />         
              </View>
          </View>
        </View>
      </Modal>

      {/* Modal for viewing contact details */}
      {selectedContact && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={viewModalVisible}
          onRequestClose={closeViewModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.header}>Contact Details</Text>
              <Text style={styles.contactNumber}>Contact #: {selectedContact.contactNumber}</Text>
              <Text style={styles.contactName}>Name: {selectedContact.name}</Text>
              <Text style={styles.contactText}>Address: {selectedContact.address}</Text>
              <View style={styles.buttonContainer}>
                <Button title="Close" onPress={closeViewModal} color="#007BFF" />
                <TouchableOpacity onPress={() => startEditContact(selectedContact)}>
                  <Image
                    source={require('../../assets/images/contacts/editIcon.png')}
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ContactScreen;
