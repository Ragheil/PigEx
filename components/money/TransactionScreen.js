import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config2'; // Adjust the path to your Firebase config
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // Import the library
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import TransactionScreenStyles from '../../frontend/money/TransactionScreenStyles'; // Adjust the path as necessary
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'; // Import date picker
import { BarChart } from 'react-native-chart-kit'; // Import the bar chart component
import { Dimensions } from 'react-native';
const TransactionScreen = ({ route }) => {
  const { selectedBranch, userId } = route.params;
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // Default to month
  const [transactions, setTransactions] = useState([]);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    farmName: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0); // Added state for total balance
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      { label: 'Money In', data: [] },
      { label: 'Money Out', data: [] },
    ],
  });
  const [farmName, setFarmName] = useState(''); // Use farmName to display dynamically
  const [farmBranchName, setFarmBranchName] = useState('Unknown Branch'); // Store the fetched farm name
  const [branchFarmName, setBranchFarmName] = useState('');

const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  useEffect(() => {
    const unsubscribeUser = fetchUserDetails();
    fetchTransactionRecords();

    return () => {
      if (typeof unsubscribeUser === 'function') {
        unsubscribeUser();
      }
    };
  }, [userId, selectedBranch]);

  const fetchUserDetails = async () => {
    const userRef = doc(firestore, `users/${userId}`);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const branchFarmName = selectedBranch === 'Main Farm' ? data.farmName || 'N/A' : selectedBranch;
        setFarmName(branchFarmName); // Dynamically set the farm name
      }
    });
  };
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
                    setFarmBranchName(branchData.farmName || 'Unknown Branch'); // Update this line
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

    fetchFarmBranchName();
}, [selectedBranch, userId]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchDocRef = doc(firestore, `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}`);
        const branchDoc = await getDoc(branchDocRef);
        if (branchDoc.exists()) {
          const branchData = branchDoc.data();
          setBranchFarmName(branchData.farmName || 'Unknown Branch');
        } else {
          setBranchFarmName('Unknown Branch');
        }
      } catch (err) {
        setError('Failed to fetch branch name');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedBranch, userId]);
  
  const fetchTransactionRecords = async () => {
    try {
      const moneyInPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyInRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyInRecords`;
  
      const moneyInRecordsRef = collection(firestore, moneyInPath);
      const inRecordsSnapshot = await getDocs(moneyInRecordsRef);
  
      let incoming = [];
      inRecordsSnapshot.forEach((doc) => {
        const recordData = { id: doc.id, ...doc.data(), type: 'in' };
        incoming.push(recordData);
      });
  
      const moneyOutPath = selectedBranch === 'Main Farm'
        ? `users/${userId}/farmBranches/Main Farm/moneyOutRecords`
        : `users/${userId}/farmBranches/Farm Branch/Branches/${selectedBranch}/moneyOutRecords`;
  
      const moneyOutRecordsRef = collection(firestore, moneyOutPath);
      const outRecordsSnapshot = await getDocs(moneyOutRecordsRef);
  
      let outgoing = [];
      outRecordsSnapshot.forEach((doc) => {
        const recordData = { id: doc.id, ...doc.data(), type: 'out' };
        outgoing.push(recordData);
      });
  
      const combinedTransactions = [...incoming, ...outgoing];
  
      setTransactions(combinedTransactions);
      setFilteredTransactions(combinedTransactions); // Set initial filtered transactions
      calculateTotals(combinedTransactions); // Calculate initial totals
    } catch (error) {
      console.error('Error fetching transaction records:', error);
    }
  };
  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactionRecords();
    setRefreshing(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const calculateTotals = (transactions) => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'in') {
        incomeTotal += parseFloat(transaction.amount) || 0;
      } else {
        expenseTotal += parseFloat(transaction.amount) || 0;
      }
    });

    setTotalIncome(incomeTotal);
    setTotalExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal); // Update balance based on new totals
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filterTransactionsByDate = () => {
    // Reset time to the start of the day (00:00:00) for accurate comparisons
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(endDate.setHours(23, 59, 59, 999)); // Set to the end of the day
  
    const filtered = transactions
      .filter((transaction) => {
        // Check if the transaction.date is a Firebase Timestamp, and convert it
        const transactionDate = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
        
        return transactionDate >= start && transactionDate <= end;
      })
      .sort((a, b) => {
        const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
        return dateB - dateA; // Newest first
      });
  
    setFilteredTransactions(filtered);
    calculateTotals(filtered);
  };
  

  const groupByDate = (transactions) => {
    return transactions.reduce((grouped, transaction) => {
      const date = transaction.date.toDateString(); // Convert to readable date
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
      return grouped;
    }, {});
  };

  const openDatePicker = (type) => {
    DateTimePickerAndroid.open({
      value: type === 'start' ? startDate : endDate,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          if (type === 'start') {
            setStartDate(selectedDate);
          } else {
            setEndDate(selectedDate);
          }
          filterTransactionsByDate();
        }
      },
      mode: 'date',
      is24Hour: true,
    });
  };

  const groupedTransactions = filteredTransactions
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
  .reduce((acc, transaction) => {
    const dateKey = formatDate(transaction.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {});

  const generatePDF = async () => {
    // Helper function to format the date into words
    const formatDateToWords = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return 'Invalid Date'; // Handle invalid dates
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString(undefined, options); // Format the date to words
    };

    // Helper function to format the time
    const formatTime = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return 'Invalid Time'; // Handle invalid dates
        }
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return d.toLocaleTimeString(undefined, options); // Format the time
    };

    // Get the current date and time
    const currentDate = new Date();
    const formattedCurrentDate = formatDateToWords(currentDate);
    const formattedCurrentTime = formatTime(currentDate);

    // Start building the HTML content for the PDF
    //  <h3 style="text-align: left;">As of: ${formattedCurrentDate} at ${formattedCurrentTime}</h3>
    let htmlContent = `
        <div style="margin: 20px;">
            <h1 style="text-align: center;">PigEx Transaction Report</h1>
           
            <h3 style="text-align: left;">Time Requested: ${formattedCurrentTime}</h3>
            <h2 style="text-align: left;">Branch Name: ${farmBranchName}</h2> <!-- Use farmBranchName here -->
            <h3 style="text-align: left;">Total Balance: ₱${totalBalance.toFixed(2)}</h3>
            <h3 style="text-align: left;">Total Income: ₱${totalIncome.toFixed(2)}</h3>
            <h3 style="text-align: left;">Total Expense: ₱${totalExpense.toFixed(2)}</h3>
            <table border="1" width="100%" style="border-collapse: collapse; table-layout: fixed;">
                <thead>
                    <tr>
                        <th style="width: 25%; text-align: center;">Time</th>
                        <th style="width: 30%; text-align: center;">Description</th>
                        <th style="width: 25%; text-align: center;">Type of Money</th>
                        <th style="width: 23%; text-align: center;">Amount</th>
                        <th style="width: 25%; text-align: center;">Remarks</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Loop through grouped transactions by date
    for (const date in groupedTransactions) {
        const firstTransactionDate = groupedTransactions[date][0].date; // Get the date of the first transaction
        const formattedHeaderDate = formatDateToWords(firstTransactionDate); // Format that date for display

        // Add the date header for each group of transactions
        htmlContent += `
            <tr>
                <td colspan="6" style="font-weight: bold; text-align: center; padding: 10px; background-color: #D7FBC0FF;">
                    ${formattedHeaderDate}
                </td>
            </tr>
        `;

        // Loop through transactions for the current date
        for (const transaction of groupedTransactions[date]) {
            const transactionDate = new Date(transaction.date);
            if (isNaN(transactionDate.getTime())) {
                console.error(`Invalid date found: ${transaction.date}`);
                continue; // Skip this transaction if the date is invalid
            }

            const formattedTime = transaction.time; // Assuming time is stored in the transaction object
            const amountColor = transaction.type === 'in' ? 'green' : 'red';
            const amountSign = transaction.type === 'in' ? '+' : '-';
            const formattedAmount = `${amountSign} ₱${parseFloat(transaction.amount).toFixed(2)}`;

            htmlContent += `
                <tr>
                    <td style="padding: 8px; text-align: center;">${formattedTime}</td>
                    <td style="padding : 8px; text-align: center;">${transaction.category || 'N/A'}</td>
                    <td style="padding: 8px; text-align: center;">${transaction.type}</td>
                    <td style="color : ${amountColor}; text-align: center; padding: 8px;">${formattedAmount}</td>
                    <td style="padding: 8px; text-align: center;">${transaction.remarks || 'No remarks provided.'}</td>
                </tr>
            `;
        }
    }

    htmlContent += `
                </tbody>
            </table>
            <div style="margin-top: 30px; text-align: center;">
                <p>--- End of Report ---</p>
            </div>
        </div>
    `;

    try {
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
        });

        const downloadsDir = FileSystem.documentDirectory + 'downloads/';
        const fileName = 'PigEx Transaction Report.pdf';
        const fileUri = downloadsDir + fileName;

        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
        await FileSystem.moveAsync({
            from: uri,
            to: fileUri,
        });

        await Sharing.shareAsync(fileUri, {
            dialogTitle: 'Share PigEx Transaction Report',
        });

        Alert.alert('Success', 'PDF generated and ready to share!');

    } catch (error) {
        console.error('Error creating or sharing PDF:', error);
        Alert.alert('Error', 'Could not create PDF file.');
    }
};
  


  
  
const generateBarChartData = () => {
  const data = {
      labels: [], // Labels for the chart
      datasets: [
          {
              label: 'Money In',
              data: [], // Values for Money In
              color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green
          },
          {
              label: 'Money Out',
              data: [], // Values for Money Out
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red
          },
      ],
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDay();

  // Calculate the start and end dates of the current week
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const selectedDateRange = selectedPeriod || 'week'; // Default to 'week'

  if (selectedDateRange === 'week') {
      data.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data.datasets[0].data = Array(7).fill(0);
      data.datasets[1].data = Array(7).fill(0);

      filteredTransactions.forEach(transaction => {
          const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
          if (date >= startOfWeek && date <= endOfWeek) {
              const dayIndex = date.getDay();
              if (transaction.type === 'in') {
                  data.datasets[0].data[dayIndex] += parseFloat(transaction.amount) || 0;
              } else {
                  data.datasets[1].data[dayIndex] += parseFloat(transaction.amount) || 0;
              }
          }
      });
  } else if (selectedDateRange === 'month') {
      data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data.datasets[0].data = Array(4).fill(0);
      data.datasets[1].data = Array(4).fill(0);

      filteredTransactions.forEach(transaction => {
          const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
              const weekNumber = Math.floor((date.getDate() - 1) / 7);
              if (weekNumber >= 0 && weekNumber < 4) {
                  if (transaction.type === 'in') {
                      data.datasets[0].data[weekNumber] += parseFloat(transaction.amount) || 0;
                  } else {
                      data.datasets[1].data[weekNumber] += parseFloat(transaction.amount) || 0;
                  }
              }
          }
      });
  } else if (selectedDateRange === 'year') {
      data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data.datasets[0].data = Array(12).fill(0);
      data.datasets[1].data = Array(12).fill(0);

      filteredTransactions.forEach(transaction => {
          const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
          if (date.getFullYear() === currentYear) {
              const monthIndex = date.getMonth();
              if (transaction.type === 'in') {
                  data.datasets[0].data[monthIndex] += parseFloat(transaction.amount) || 0;
              } else {
                  data.datasets[1].data[monthIndex] += parseFloat(transaction.amount) || 0;
              }
          }
      });
  }

  return data;
};




useEffect(() => {
  const chartData = generateBarChartData();
  setBarChartData(chartData);
}, [filteredTransactions, selectedPeriod]);


   const getSortedTransactions = (transactions) => {
    // Sort by latest date for monthly view
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

 const getMonthName = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[new Date(date).getMonth()];
  };
  
  const renderMonthlyGraph = (transactions) => {
    const currentMonth = getMonthName(new Date());
    
    // Sort transactions by day within the selected month
    const sortedTransactions = getSortedTransactions(transactions);
    
    return (
      <Bar
        data={{
          labels: sortedTransactions.map(t => t.date), // display each date in the selected month
          datasets: [
            {
              label: 'Income',
              backgroundColor: 'green',
              data: sortedTransactions.map(t => t.type === 'in' ? t.amount : 0)
            },
            {
              label: 'Expenses',
              backgroundColor: 'red',
              data: sortedTransactions.map(t => t.type === 'out' ? t.amount : 0)
            }
          ]
        }}
        options={{
          title: {
            display: true,
            text: currentMonth // Display current month on top
          },
          scales: {
            x: {
              reverse: true // Reverse x-axis to make latest date on the left
            }
          }
        }}
      />
    );
  };
  
  const getSortedByYear = (transactions) => {
    return transactions.sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear());
  };
  
  const renderYearlyGraph = (transactions) => {
    const sortedByYear = getSortedByYear(transactions);
    
    return (
      <Bar
        data={{
          labels: sortedByYear.map(t => new Date(t.date).getFullYear()), // display years
          datasets: [
            {
              label: 'Income',
              backgroundColor: 'green',
              data: sortedByYear.map(t => t.type === 'in' ? t.amount : 0)
            },
            {
              label: 'Expenses',
              backgroundColor: 'red',
              data: sortedByYear.map(t => t.type === 'out' ? t.amount : 0)
            }
          ]
        }}
        options={{
          scales: {
            x: {
              reverse: false // Do not reverse for yearly view, keep ascending order
            }
          }
        }}
      />
    );
  };

  
  return (
    <View style={TransactionScreenStyles.container}>
      <Text style={TransactionScreenStyles.headerText}> Transaction </Text>
      <View style={TransactionScreenStyles.infoContainer}>
      <Text style={TransactionScreenStyles.infoText}>
  Farm Name: {farmBranchName}
</Text>

        <Text style={TransactionScreenStyles.subHeaderText}>
          Total Balance: <Text style={TransactionScreenStyles.totalBalanceText}>₱{totalBalance.toFixed(2)}</Text>
        </Text>
        <Text style={TransactionScreenStyles.subHeaderText}>
          Total Income: <Text style={TransactionScreenStyles.totalIncomeText}>₱{totalIncome.toFixed(2)}</Text>
        </Text>
        <Text style={TransactionScreenStyles.subHeaderText}>
          Total Expense: <Text style={TransactionScreenStyles.totalExpenseText}>₱{totalExpense.toFixed(2)}</Text>
        </Text>
      </View>

      <View>
        <TouchableOpacity onPress={() => openDatePicker('start')}>
          <Text>Select Start Date: {startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openDatePicker('end')}>
          <Text>Select End Date: {endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
<View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
    <Button title="Week" onPress={() => setSelectedPeriod('week')} />
    <Button title="Month" onPress={() => setSelectedPeriod('month')} />
    <Button title="Year" onPress={() => setSelectedPeriod('year')} />
</View>




<View style={{ alignItems: 'center', marginVertical: 20 }}>
<ScrollView horizontal>
<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
    <View style={{ alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
            {selectedPeriod === 'week'
                ? 'Weekly Money In'
                : selectedPeriod === 'month'
                ? `${new Date().toLocaleString('default', { month: 'long' })} Money In`
                : 'Yearly Money In'}
        </Text>
        <BarChart
            data={{
                labels: barChartData.labels,
                datasets: [
                    {
                        label: 'Money In',
                        data: barChartData.datasets[0].data,
                        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green
                    },
                ],
            }}
            width={Math.max(screenWidth / 2, barChartData.labels.length * 30)} // Adjust width for horizontal scrolling
            height={220}
            chartConfig={{
                backgroundColor: '#94E334FF',
                backgroundGradientFrom: '#9ED74AFF',
                backgroundGradientTo: '#FFFFFFFF',
                decimalPlaces: 2,
                barPercentage: 0.5,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
            verticalLabelRotation={30}
        />
    </View>

    <View style={{ alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
            {selectedPeriod === 'week'
                ? 'Weekly Money Out'
                : selectedPeriod === 'month'
                ? `${new Date().toLocaleString('default', { month: 'long' })} Money Out`
                : 'Yearly Money Out'}
        </Text>
        <BarChart
            data={{
                labels: barChartData.labels,
                datasets: [
                    {
                        label: 'Money Out',
                        data: barChartData.datasets[1].data,
                        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red
                    },
                ],
            }}
            width={Math.max(screenWidth / 2, barChartData.labels.length * 30)} // Adjust width for horizontal scrolling
            height={220}
            chartConfig={{
                backgroundColor: '#94E334FF',
                backgroundGradientFrom: '#9ED74AFF',
                backgroundGradientTo: '#FFFFFFFF',
                decimalPlaces: 2,
                barPercentage: 0.5,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
            verticalLabelRotation={30}
        />
    </View>
</View>
</ScrollView>


</View>


      {filteredTransactions.length > 0 ? (
  Object.entries(groupedTransactions).map(([date, transactions]) => (
    <View key={date} style={TransactionScreenStyles.transactionContainer}>
      <Text style={TransactionScreenStyles.dateText}>{date}</Text>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={TransactionScreenStyles.transactionItem}>
          <Text style={TransactionScreenStyles.transactionLabel}>
            <Text style={TransactionScreenStyles.categoryText}>{transaction.category || 'N/A'}</Text>:
            <Text style={transaction.type === 'in' ? TransactionScreenStyles.income : TransactionScreenStyles.expense}>
              ₱{parseFloat(transaction.amount).toFixed(2)}
            </Text>
          </Text>
          <Text style={TransactionScreenStyles.remarksText}>
            Remarks: {transaction.remarks || 'No remarks provided.'}
          </Text>
        </View>
      ))}
    </View>
  ))
) : (
  <Text style={TransactionScreenStyles.noTransactionsText}>No transactions found.</Text>
)}
      </ScrollView>
 
      <TouchableOpacity style={TransactionScreenStyles.pdfButton} onPress={generatePDF}>
        <Text style={TransactionScreenStyles.pdfButtonText}>Generate PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={TransactionScreenStyles.backButton} onPress={handleGoBack}>
        <Text style={TransactionScreenStyles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionScreen;