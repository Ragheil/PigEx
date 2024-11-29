import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, Pressable, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config2'; 
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MoneyOutScreenStyles from '../../frontend/money/MoneyOutScreenStyles'; // Import the styles
import NetInfo from '@react-native-community/netinfo'; // For network status
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('Device is online, syncing data...');
        fetchMoneyRecords(); // Fetch records when online
      }
    });

    fetchMoneyRecords(); // Initial fetch
    return () => unsubscribe();
  }, [selectedBranch, userId]);


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTotalBalance();
    await fetchMoneyRecords();
    setRefreshing(false);
  };
  
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
  
      // Sort records by date (latest first)
      const sortedRecords = records.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      // Group records by formatted date
      const groupedRecords = sortedRecords.reduce((groups, record) => {
        // Format the date into "Month Day, Year" format
        const recordDate = new Date(record.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        if (!groups[recordDate]) {
          groups[recordDate] = [];
        }
        groups[recordDate].push(record);
        return groups;
      }, {});
  
      // Convert the grouped records to an array for rendering
      const groupedRecordsArray = Object.keys(groupedRecords).map(date => ({
        date, // This will now be a formatted string like "November 10, 2024"
        records: groupedRecords[date],
      }));
  
      setMoneyRecords(groupedRecordsArray);
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
        date: date.toISOString(), // Store date as ISO string
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Store time as a formatted string
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
        date: date.toISOString(), // Store date as ISO string
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Store time as a formatted string
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
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  console.log(formattedDate);
  const renderMoneyRecord = ({ item }) => (
    <View style={{
      // backgroundColor: 'red',
      paddingBottom: 15,
      // rowGap: 10,
      // columnGap: 10,
    }}>
      <View style={MoneyOutScreenStyles.dateGroup}>
        <Text style={MoneyOutScreenStyles.flatListItemText}>{item.date}</Text>
        {item.records.map(record => (
          <View style={MoneyOutScreenStyles.record} key={record.id}>
            <Text style={[MoneyOutScreenStyles.recordText && MoneyOutScreenStyles.recordTextAmount]}>Amount PHP: {record.amount.toFixed(2)}</Text>
            <Text style={MoneyOutScreenStyles.recordText}>Category: {record.category}</Text>
            <Text style={MoneyOutScreenStyles.recordText}>Remarks: {record.remarks}</Text>
            <Text style={MoneyOutScreenStyles.recordText}>Time: {record.time || 'Not set'}</Text> 
            <View style={MoneyOutScreenStyles.recordButtons}>
              <Pressable style={MoneyOutScreenStyles.editButton} onPress={() => {
                setAmount(record.amount.toString());
                setRemarks(record.remarks);
                setCategory(record.category);
                setCurrentRecordId(record.id);
                setModalVisible(true);
                setIsEditing(true);
    
                // Check if record.time is defined before splitting
                if (record.time) {
                  const [hours, minutes] = record.time.split(':');
                  const [parsedHours, period] = hours.split(' '); // Split to get AM/PM
                  let hour = parseInt(parsedHours, 10);
                  if (period === 'PM' && hour < 12) {
                    hour += 12; // Convert PM hour to 24-hour format
                  } else if (period === 'AM' && hour === 12) {
                    hour = 0; // Convert 12 AM to 0 hours
                  }
    
                  const newTime = new Date();
                  newTime.setHours(hour);
                  newTime.setMinutes(parseInt(minutes, 10));
                  setTime(newTime); // Set the time for editing
                } else {
                  // If time is not set, you can set a default time (e.g., current time)
                  setTime(new Date()); // Set to current time or any default time
                }
              }}>
                <Text style={MoneyOutScreenStyles.buttonText}>Edit</Text>
              </Pressable>
              <Pressable style={MoneyOutScreenStyles.deleteButton} onPress={() => handleDeleteMoney(record.id)}>
                <Text style={MoneyOutScreenStyles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={MoneyOutScreenStyles.container}>
      <SafeAreaView style={MoneyOutScreenStyles.headercontainer}>
      <Text style={MoneyOutScreenStyles.balanceNumber}>₱ {totalBalance.toFixed(2)}</Text>
      <Text style={MoneyOutScreenStyles.balance}>Total Balance</Text>
      </SafeAreaView>
      
      <Text style={MoneyOutScreenStyles.title}>Money Out Records</Text>
      <Text style={MoneyOutScreenStyles.farmName}>Current Branch: {farmBranchName || 'No branch selected'}</Text>

      <FlatList
        data={moneyRecords}
        renderItem={renderMoneyRecord}
        keyExtractor={(item, index) => item.date + index}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <View style={MoneyOutScreenStyles.addbuttonContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          // onPress={openAddContactModal}
          style={MoneyOutScreenStyles.addMoneyButton}
        >
          <Text style={MoneyOutScreenStyles.addMoneyButtonText}>Add Money Out</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={MoneyOutScreenStyles.modalContent}>
          <Text style={MoneyOutScreenStyles.modalTitle}>{isEditing ? 'Edit Money Out' : 'Add Money Out'}</Text>
          <TextInput
            style={MoneyOutScreenStyles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={MoneyOutScreenStyles.input}
            placeholder="Remarks"
            value={remarks}
            onChangeText={setRemarks}
          />
          <RNPickerSelect
            onValueChange={handleCategoryChange}
            items={[
              { label: 'Expense', value: 'expense' },
              { label: 'Bill', value: 'bill' },
              { label: 'Other', value: 'other' },
            ]}
            placeholder={{ label: 'Select a category', value: null }} // Optional placeholder
            style={{
              inputIOS: MoneyOutScreenStyles.input,
              inputAndroid: MoneyOutScreenStyles.input,
            }}
          />
          {showOtherCategoryInput && (
            <TextInput
              style={MoneyOutScreenStyles.input}
              placeholder="Specify Category"
              value={otherCategory}
              onChangeText={setOtherCategory}
            />
          )}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <Text style={MoneyOutScreenStyles.dateText}>{date.toDateString()}</Text>
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
          <Pressable onPress={() => setShowTimePicker(true)}>
            <Text style={MoneyOutScreenStyles.dateText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}
          <Pressable style={MoneyOutScreenStyles.saveButton} onPress={isEditing ? handleEditMoney : handleAddMoney}>
            <Text style={MoneyOutScreenStyles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
          </Pressable>
          <Pressable style={MoneyOutScreenStyles.cancelButton} onPress={resetModalState}>
            <Text style={MoneyOutScreenStyles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};




export default MoneyOutScreen;