import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, Pressable, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config2'; // Adjust path as needed
import { Picker } from '@react-native-picker/picker'; // Ensure this package is installed
import DateTimePicker from '@react-native-community/datetimepicker'; // For picking the date
import styles from '../../frontend/money/MoneyInScreenStyles';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';

const MoneyInScreen = ({ route }) => {
  const { farmName, selectedBranch, userId } = route.params; // Get farmName, selectedBranch, and userId from route params
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [totalBalance, setTotalBalance] = useState(0); // State for total balance
  const [category, setCategory] = useState('salary'); // Default income category
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false); // State to show/hide text input for other category
  const [otherCategory, setOtherCategory] = useState(''); // Store other category
  const [date, setDate] = useState(new Date()); // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false); // Show date picker state
  const [isModalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [moneyRecords, setMoneyRecords] = useState([]); // State to hold money records
  const [currentRecordId, setCurrentRecordId] = useState(null); // ID of the record being edited
  const [isEditing, setIsEditing] = useState(false); // State to track if we're in edit mode
  const [time, setTime] = useState(new Date()); // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false); // Show time picker state
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTotalBalance();
    fetchMoneyRecords();
  }, [selectedBranch, userId]);

  const fetchTotalBalance = async () => {
    try {
      const moneyInPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;
  
      const moneyInRecordsRef = collection(firestore, moneyInPath);
      const inRecordsSnapshot = await getDocs(moneyInRecordsRef);
  
      let totalIn = 0;
      inRecordsSnapshot.forEach((doc) => {
        const data = doc.data();
        const recordAmount = parseFloat(data.amount) || 0;
        totalIn += recordAmount;
      });
  
      const moneyOutPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords`;
  
      const moneyOutRecordsRef = collection(firestore, moneyOutPath);
      const outRecordsSnapshot = await getDocs(moneyOutRecordsRef);
  
      let totalOut = 0;
      outRecordsSnapshot.forEach((doc) => {
        const data = doc.data();
        const recordAmount = parseFloat(data.amount) || 0;
        totalOut += recordAmount;
      });
  
      setTotalBalance(totalIn - totalOut); // Update total balance state
    } catch (error) {
      console.error('Error fetching total balance:', error);
    }
  };
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  
  const fetchMoneyRecords = async () => {
    try {
      const moneyInPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;
  
      const moneyInRecordsRef = collection(firestore, moneyInPath);
      const inRecordsSnapshot = await getDocs(moneyInRecordsRef);
  
      // Collect records and group by date
      const recordsByDate = {};
      inRecordsSnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.date).toDateString(); // Convert to date string for grouping
        if (!recordsByDate[date]) {
          recordsByDate[date] = [];
        }
        recordsByDate[date].push({ id: doc.id, ...data });
      });
  
      // Convert object to an array of date groups, sorted by date in descending order
      const sortedRecords = Object.keys(recordsByDate)
        .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
        .map((date) => ({ date, records: recordsByDate[date] }));
  
      setMoneyRecords(sortedRecords); // Update state with grouped and sorted records
    } catch (error) {
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
        date: date.toISOString().split('T')[0], // Store date in YYYY-MM-DD format
        time: time.toISOString().split('T')[1].substring(0, 5), // Store time in HH:MM format
        category: selectedCategory,
      };
  
      const path = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;
  
      const moneyInRecordsRef = collection(firestore, path);
      await addDoc(moneyInRecordsRef, moneyRecord);
  
      Alert.alert('Success', 'Money added successfully!');
      fetchTotalBalance();
      fetchMoneyRecords();
      setAmount('');
      setRemarks('');
      setCategory('salary');
      setOtherCategory('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding money record:', error);
      Alert.alert('Error', 'Failed to add money. Please try again.');
    }
  };
  
  

  const handleEditMoney = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }

    // Format time separately as HH:MM
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const moneyRecord = {
      amount: parseFloat(amount),
      remarks,
      date: date.toISOString(),  // Store date as main date
      time: formattedTime,        // Store time as separate field
    };

    const path = selectedBranch === 'Main Farm'
      ? `users/${userId}/farmBranches/Main Farm/moneyInRecords/${currentRecordId}`
      : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords/${currentRecordId}`;

    try {
      const moneyRecordRef = doc(firestore, path);
      await updateDoc(moneyRecordRef, moneyRecord);

      Alert.alert('Success', 'Money record updated successfully!');
      fetchTotalBalance();
      fetchMoneyRecords();
      setAmount('');
      setRemarks('');
      setIsEditing(false);
      setCurrentRecordId(null);
    } catch (error) {
      console.error('Error updating money record:', error);
      Alert.alert('Error', 'Failed to update money record. Please try again.');
    }
  };

const handleDeleteMoney = async (id) => {
  try {
    const confirmation = await new Promise((resolve) => {
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
      const path = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords/${id}`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords/${id}`; // Use userId here

      const moneyRecordRef = doc(firestore, path);
      await deleteDoc(moneyRecordRef);

      Alert.alert('Success', 'Money record deleted successfully!');
      fetchTotalBalance(); // Update balance after deleting money
      fetchMoneyRecords(); // Fetch updated records after deleting money
    }
  } catch (error) {
    console.error('Error deleting money record:', error);
    Alert.alert('Error', 'Failed to delete money record. Please try again.');
  }
};

  const handleCategoryChange = (value) => {
    setCategory(value);
    setShowOtherCategoryInput(value === 'other');
  };
  
  const formatBalance = (balance) => {
    return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const renderMoneyRecord = ({ item }) => (
    <View style={{
      // backgroundColor: 'red',
      paddingBottom: 15,
      // rowGap: 10,
      // columnGap: 10,
    }}>
      <View style={styles.dateGroup}>
        <Text style={styles.dateHeader}>{item.date}</Text>
        {item.records.map((record) => (
          <View key={record.id} style={styles.record}>
            <Text style={[styles.recordText && styles.recordTextAmount]}>Amount PHP: {formatBalance(record.amount)}</Text>
            <Text style={styles.recordText}>Category: {record.category}</Text>
            <Text style={styles.recordText}>Remarks: {record.remarks}</Text>
            <View style={styles.recordButtons}>
              <Pressable
                style={styles.editButton}
                onPress={() => {
                  setAmount(record.amount.toString());
                  setRemarks(record.remarks);
                  setCategory(record.category);
                  setCurrentRecordId(record.id);
                  setModalVisible(true);
                  setIsEditing(true);
                }}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => handleDeleteMoney(record.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTotalBalance();
    await fetchMoneyRecords();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headercontainer}>
        <Text style={styles.balanceNumber}>₱ {formatBalance(totalBalance)}</Text>
        <Text style={styles.balance}>Total Balance</Text>
      </SafeAreaView>
      
      <Text style={styles.title}>Money In Records</Text>
      <Text style={styles.farmName}>Current Branch: {farmName || 'No branch selected'}</Text>
      
      <FlatList
        data={moneyRecords}
        keyExtractor={(item) => item.date}
        renderItem={renderMoneyRecord}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />


      {/* Modal for adding/editing money record */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Money Record' : 'Add Money'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={(text) => setAmount(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Remarks"
              value={remarks}
              onChangeText={(text) => setRemarks(text)}
            />
          <RNPickerSelect
            onValueChange={handleCategoryChange}
            items={[
              { label: 'Salary', value: 'salary' },
              { label: 'Sales', value: 'sales' },
              { label: 'Other', value: 'other' },
            ]}
            placeholder={{ label: 'Select a category', value: null }} // Optional placeholder
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
            }}
          />
            {showOtherCategoryInput && (
              <TextInput
                style={styles.input}
                placeholder="Enter other category"
                value={otherCategory}
                onChangeText={(text) => setOtherCategory(text)}
              />
            )}
            <Pressable
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>{date.toDateString()}</Text>
            </Pressable>
      {/* Date Picker */}
      <Button title="Pick Date" color='#566F48' onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text>Selected Date: {date.toLocaleDateString()}</Text>
      {/* Time Picker */}
      <Button title="Pick Time" color='#566F48' onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <Text>Selected Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>


            <View style={styles.modalButtons}>
              <Button
                title={isEditing ? 'Update' : 'Add'}
                color='#566F48'
                onPress={isEditing ? handleEditMoney : handleAddMoney}
              />
              <Button
                title="Cancel"
                color='#566F48'
                onPress={() => {
                  setModalVisible(false);
                  setIsEditing(false);
                  setCurrentRecordId(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* <Button title="Add Money" onPress={() => setModalVisible(true)} /> */}

      <View style={styles.addbuttonContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          // onPress={openAddContactModal}
          style={styles.addMoneyButton}
        >
          <Text style={styles.addMoneyButtonText}>Add Money</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default MoneyInScreen;