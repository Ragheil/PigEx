import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, Pressable, FlatList } from 'react-native';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
        date: date.toISOString(),
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
        date: date.toISOString(),
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
      <Text style={styles.recordText}>Category: {item.category}</Text>
      <Text style={styles.recordText}>Remarks: {item.remarks}</Text>
      <View style={styles.recordButtons}>
        <Pressable style={styles.editButton} onPress={() => {
          setAmount(item.amount.toString());
          setRemarks(item.remarks);
          setCategory(item.category);
          setCurrentRecordId(item.id);
          setModalVisible(true);
          setIsEditing(true);
        }}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => handleDeleteMoney(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Money Out Records</Text>
      <Text style={styles.balance}>Total Balance: PHP {totalBalance.toFixed(2)}</Text>
      <Text style={styles.farmName}>Current Branch: {selectedBranch || 'No branch selected'}</Text>

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
});

export default MoneyOutScreen;
