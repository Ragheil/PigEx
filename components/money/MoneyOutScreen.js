import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, Pressable, FlatList } from 'react-native';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config2'; 
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const MoneyOutScreen = ({ route }) => {
  const { farmName, selectedBranch, userId } = route.params;
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [category, setCategory] = useState('expense');
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false);
  const [otherCategory, setOtherCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [moneyRecords, setMoneyRecords] = useState([]);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [farmBranchName, setFarmBranchName] = useState('Unknown Branch'); // Store the fetched farm name
  const [dateTime, setDateTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  useEffect(() => {
    const fetchFarmBranchName = async () => {
      try {
        if (selectedBranch === 'Main Farm') {
          setFarmBranchName('Main Farm');
        } else {
          const branchDocRef = doc(firestore, `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}`);
          const branchDoc = await getDoc(branchDocRef);

          if (branchDoc.exists()) {
            const branchData = branchDoc.data();
            setFarmBranchName(branchData.farmName || 'Unknown Branch'); // Set the farm name
          } else {
            console.error('No such branch found.');
            setFarmBranchName('Unknown Branch');
          }
        }
      } catch (error) {
        console.error('Error fetching branch name:', error);
        Alert.alert('Error', 'Unable to fetch branch name.');
      }
    };

    if (selectedBranch) {
      fetchFarmBranchName(); // Fetch the farm name when selectedBranch is set
    }
  }, [selectedBranch, userId]);

  useEffect(() => {
    fetchTotalBalance();
    fetchMoneyRecords();
  }, [selectedBranch, userId]);

  const fetchTotalBalance = async () => {
    try {
      const moneyInPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;

      const inRecordsSnapshot = await getDocs(collection(firestore, moneyInPath));
      const totalIn = inRecordsSnapshot.docs.reduce((total, doc) => total + (parseFloat(doc.data().amount) || 0), 0);

      const moneyOutPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords`;

      const outRecordsSnapshot = await getDocs(collection(firestore, moneyOutPath));
      const totalOut = outRecordsSnapshot.docs.reduce((total, doc) => total + (parseFloat(doc.data().amount) || 0), 0);

      setTotalBalance(totalIn - totalOut);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch total balance. Please try again.');
      console.error('Error fetching total balance:', error);
    }
  };

  const fetchMoneyRecords = async () => {
    try {
      const moneyOutPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords`;

      const outRecordsSnapshot = await getDocs(collection(firestore, moneyOutPath));
      const records = outRecordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMoneyRecords(records);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch money records. Please try again.');
      console.error('Error fetching money records:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Update both date and time in one step
      const updatedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        date.getHours(),
        date.getMinutes()
      );
      setDate(updatedDate);
    }
  };

  const handleAddMoney = async () => {
    if (!amount) {
        Alert.alert('Error', 'Please enter an amount.');
        return;
    }

    const selectedCategory = category === 'other' ? otherCategory : category;

    try {
        const moneyRecord = {
            amount: parseFloat(amount),
            remarks,
            date: date.toISOString(), // Ensure you are using the updated date
            category: selectedCategory,
        };

        const path = selectedBranch === 'Main Farm'
            ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords`
            : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords`;

        await addDoc(collection(firestore, path), moneyRecord);
        Alert.alert('Success', 'Money out added successfully!');
        resetModalState();
        fetchTotalBalance();
        fetchMoneyRecords();
    } catch (error) {
        Alert.alert('Error', 'Failed to add money. Please try again.');
        console.error('Error adding money out record:', error);
    }
};
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
        // Update the date state to reflect the new time
        const updatedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );
        setDate(updatedDate);
    }
};

const handleEditMoney = async () => {
  if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
  }

  const selectedCategory = category === 'other' ? otherCategory : category;

  try {
      const moneyRecord = {
          amount: parseFloat(amount),
          remarks,
          date: date.toISOString(), // Ensure you are using the updated date
          category: selectedCategory,
      };

      const path = selectedBranch === 'Main Farm'
          ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords/${currentRecordId}`
          : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords/${currentRecordId}`;

      await updateDoc(doc(firestore, path), moneyRecord);
      Alert.alert('Success', 'Money out record updated successfully!');
      resetModalState();
      fetchTotalBalance();
      fetchMoneyRecords();
  } catch (error) {
      Alert.alert('Error', 'Failed to update money record. Please try again.');
      console.error('Error updating money out record:', error);
  }
};

  const handleDeleteMoney = async (id) => {
    const confirmation = await new Promise(resolve => {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this record?',
        [
          { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Delete', onPress: () => resolve(true) },
        ]
      );
    });

    if (confirmation) {
      try {
        const path = selectedBranch === 'Main Farm'
          ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords/${id}`
          : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords/${id}`;

        await deleteDoc(doc(firestore, path));
        Alert.alert('Success', 'Money out record deleted successfully!');
        fetchTotalBalance();
        fetchMoneyRecords();
      } catch (error) {
        Alert.alert('Error', 'Failed to delete money record. Please try again.');
        console.error('Error deleting money out record:', error);
      }
    }
  };

  const resetModalState = () => {
    setAmount('');
    setRemarks('');
    setCategory('expense');
    setOtherCategory('');
    setModalVisible(false);
    setIsEditing(false);
    setCurrentRecordId(null);
    setDate(new Date()); // Reset date when modal closes
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setShowOtherCategoryInput(value === 'other');
  };

  const renderMoneyRecord = ({ item }) => (
    <View style={styles.record}>
      <Text style={styles.recordText}>Amount PHP: {item.amount.toFixed(2)}</Text>
      <Text style={styles.recordText}>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.recordText}>Remarks: {item.remarks}</Text>
      <Text style={styles.recordText}>Category: {item.category}</Text>
      <View style={styles.recordActions}>
        <Button title="Edit" onPress={() => {
          setIsEditing(true);
          setCurrentRecordId(item.id);
          setAmount(item.amount.toString());
          setRemarks(item.remarks);
          setCategory(item.category);
          setDate(new Date(item.date)); // Set the date from the selected record
          setModalVisible(true);
        }} />
        <Button title="Delete" onPress={() => handleDeleteMoney(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Money Out Records</Text>
      <Text style={styles.balance}>Total Balance: PHP {totalBalance.toFixed(2)}</Text>
      <Text style={styles.farmName}>Current Branch: {farmBranchName || 'No branch selected'}</Text>

      <FlatList
        data={moneyRecords}
        renderItem={renderMoneyRecord}
        keyExtractor={item => item.id}
      />

      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Money Out</Text>
      </Pressable>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Money Out' : 'Add Money Out'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks"
            value={remarks}
            onChangeText={setRemarks}
          />
          <Picker selectedValue={category} onValueChange={handleCategoryChange}>
            <Picker.Item label="Expense" value="expense" />
            <Picker.Item label="Other" value="other" />
            {/* Add other categories as needed */}
          </Picker>
          {showOtherCategoryInput && (
            <TextInput
              style={styles.input}
              placeholder="Specify Category"
              value={otherCategory}
              onChangeText={setOtherCategory}
            />
          )}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
           <Pressable style={styles.button} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.buttonText}>Select Time</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={dateTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <Pressable style={styles.saveButton} onPress={isEditing ? handleEditMoney : handleAddMoney}>
            <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={resetModalState}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60
  },
  balance: {
    fontSize: 18,
    marginBottom: 10,
  },
  record: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  recordText: {
    fontSize: 16,
  },
  recordButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
  },
  buttonText: {
    color: 'white',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 5,
  },
});

export default MoneyOutScreen;