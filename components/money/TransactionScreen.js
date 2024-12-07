import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert, Button, SafeAreaView, Image, width } from 'react-native';
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
import backImage from '../../assets/images/buttons/backbutton.png'; // Adjust the path as needed
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
  const [showAllTransactions, setShowAllTransactions] = useState(false);

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
  const [showMoneyIn, setShowMoneyIn] = useState(true); // Show Money In by default
  const [showMoneyOut, setShowMoneyOut] = useState(false); // Hide Money Out by default
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

  
const handleShowAllTransactions = () => {
  setShowAllTransactions(true);
  setShowMoneyIn(false);
  setShowMoneyOut(false);
  setFilteredTransactions(transactions); // Show all transactions
  setStartDate(new Date()); // Reset start date
  setEndDate(new Date()); // Reset end date
  calculateTotals(transactions); // Calculate totals for all transactions
};



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
    setStartDate(new Date()); // Reset start date
    setEndDate(new Date()); // Reset end date
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
    // Only filter if start and end dates are set
    if (startDate && endDate) {
      const start = new Date(startDate.setHours(0, 0, 0, 0));
      const end = new Date(endDate.setHours(23, 59, 59, 999));
  
      const filtered = transactions
        .filter((transaction) => {
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
    }
  };
  
  const handleShowMoneyIn = () => {
    setShowMoneyIn(true);
    setShowMoneyOut(false);
    setShowAllTransactions(false);
    const filtered = transactions.filter(transaction => transaction.type === 'in');
    setFilteredTransactions(filtered);
    calculateTotals(filtered);
  };
  const handleShowMoneyOut = () => {
    setShowMoneyIn(false);
    setShowMoneyOut(true);
    setShowAllTransactions(false);
    const filtered = transactions.filter(transaction => transaction.type === 'out');
    setFilteredTransactions(filtered);
    calculateTotals(filtered);
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
    const formatDateToWords = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return 'Invalid Date';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString(undefined, options);
    };

    // Use filteredTransactions directly as they are already the transactions displayed on the screen
    const transactionsToInclude = filteredTransactions;

    const groupedTransactions = transactionsToInclude
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .reduce((acc, transaction) => {
            const dateKey = formatDate(transaction.date);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(transaction);
            return acc;
        }, {});

    const formatTime = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return 'Invalid Time';
        }
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return d.toLocaleTimeString(undefined, options);
    };

    const currentDate = new Date();
    const formattedCurrentDate = formatDateToWords(currentDate);
    const formattedCurrentTime = formatTime(currentDate);

    let htmlContent = `
        <div style="margin: 20px;">
            <h1 style="text-align: center;">PigEx Transaction Report</h1>
            <h3 style="text-align: left;">Time Requested: ${formattedCurrentTime}</h3>
            <h2 style="text-align: left;">Branch Name: ${farmBranchName}</h2>
            <h3 style="text-align: left;">Total Balance: ₱${totalBalance.toFixed(2)}</h3>
            <h3 style="text-align: left;">Total Income: ₱${totalIncome.toFixed(2)}</h3>
            <h3 style="text-align: left;">Total Expense: ₱${totalExpense.toFixed(2)}</h3>
            <table border="1" width="100%" style="border-collapse: collapse; table-layout: fixed;">
                <thead>
                    <tr>
                        <th style="width: 25%; text-align: center;">Time</th>
                        <th style="width: 30%; text-align: center;">Description</th>
                        <th style="width: 25%; text-align: center;">Cash Flow</th>
                        <th style="width: 23%; text-align: center;">Amount</th>
                        <th style="width: 25%; text-align: center;">Remarks</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (const date in groupedTransactions) {
        const firstTransactionDate = groupedTransactions[date][0].date;
        const formattedHeaderDate = formatDateToWords(firstTransactionDate);

        htmlContent += `
            <tr>
                <td colspan="5" style="font-weight: bold; text-align: center; padding: 10px; background-color: #D7FBC0FF;">
                    ${formattedHeaderDate}
                </td>
            </tr>
        `;

        for (const transaction of groupedTransactions[date]) {
            const transactionDate = new Date(transaction.date);
            if (isNaN(transactionDate.getTime())) {
                console.error(`Invalid date found: ${transaction.date}`);
                continue;
            }

            const formattedTime = transaction.time; // Assuming time is stored in the transaction object
            const amountColor = transaction.type === 'in' ? 'green' : 'red';
            const amountSign = transaction.type === 'in' ? '+' : '-';
            const formattedAmount = `${amountSign} ₱${parseFloat(transaction.amount).toFixed(2)}`;

            htmlContent += `
                <tr>
                    <td style="padding: 8px; text-align: center;">${formattedTime}</td>
                    <td style="padding: 8px; text-align: center;">${transaction.category || 'N/A'}</td>
                    <td style="padding: 8px; text-align: center;">${transaction.type}</td>
                    <td style="color: ${amountColor}; text-align: center; padding: 8px;">${formattedAmount}</td>
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
    labels: [],
    datasets: [
      {
        label: 'Money In',
        data: [],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green
      },
      {
        label: 'Money Out',
        data: [],
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
      data.datasets[0].data = Array(7).fill(0); // Money In
      data.datasets[1].data = Array(7).fill(0); // Money Out

      filteredTransactions.forEach(transaction => {
          const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
          if (date >= startOfWeek && date <= endOfWeek) {
              const dayIndex = date.getDay();
              if (showMoneyIn && transaction.type === 'in') {
                data.datasets[0].data[dayIndex] += parseFloat(transaction.amount) || 0; // Money In
              } else if (showMoneyOut && transaction.type === 'out') {
                data.datasets[1].data[dayIndex] += parseFloat(transaction.amount) || 0; // Money Out
              }
            }
          });
  } else if (selectedDateRange === 'month') {
      data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data.datasets[0].data = Array(4).fill(0); // Money In
      data.datasets[1].data = Array(4).fill(0); // Money Out

      filteredTransactions.forEach(transaction => {
          const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
          if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
              const weekNumber = Math.floor((date.getDate() - 1) / 7);
              if (weekNumber >= 0 && weekNumber < 4) {
                  if (transaction.type === 'in') {
                      data.datasets[0].data[weekNumber] += parseFloat(transaction.amount) || 0; // Money In
                  } else if (transaction.type === 'out') {
                      data.datasets[1].data[weekNumber] += parseFloat(transaction.amount) || 0; // Money Out
                  }
              }
          }
      });
  } else if (selectedDateRange === 'year') {
      data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data.datasets[0].data = Array(12).fill(0); // Money In
      data.datasets[1].data = Array(12).fill (0); // Money Out

      filteredTransactions.forEach(transaction => {
          const date = transaction.date.toDate ? transaction.date.toDate() : new Date(transaction.date);
          if (date.getFullYear() === currentYear) {
              const monthIndex = date.getMonth();
              if (transaction.type === 'in') {
                  data.datasets[0].data[monthIndex] += parseFloat(transaction.amount) || 0; // Money In
              } else if (transaction.type === 'out') {
                  data. datasets[1].data[monthIndex] += parseFloat(transaction.amount) || 0; // Money Out
              }
          }
      });
  }
  setBarChartData(data);
};




useEffect(() => {
  generateBarChartData();
}, [filteredTransactions, selectedPeriod, showMoneyIn, showMoneyOut]);

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
  const TransactionGraph = ({ transactions, viewType }) => {
    if (viewType === 'monthly') {
      return renderMonthlyGraph(transactions);
    } else if (viewType === 'yearly') {
      return renderYearlyGraph(transactions);
    } else {
      // Default or fallback if needed
      return null;
    }
  };
  
  const formatBalance = (balance) => {
    return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  const periods = [
    { title: "Week", value: "week" },
    { title: "Month", value: "month" },
    { title: "Year", value: "year" },
  ];
  const navbuttonColor = '#566F48';

  return (
    <SafeAreaView style={TransactionScreenStyles.container}>

      <View style={TransactionScreenStyles.header}>
        <View style={TransactionScreenStyles.navheader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={TransactionScreenStyles.navibackButton}>
            <Image source={backImage} style={TransactionScreenStyles.backImage} />
          </TouchableOpacity>
          <Text style={TransactionScreenStyles.headerText}>Transaction </Text>
        </View>
          <View style={{}}>
            <View style={TransactionScreenStyles.infoHeader}>
              <View
                  style={{
                    flex: .75,
                    // width: '100%',
                    flexDirection: 'column',
                    // padding: 10,
                    // width: width * 0.9, // 90% of screen width
                    alignSelf: 'center', // Center the container
                    // backgroundColor: 'lightblue'
                  }}
                >
                  <TouchableOpacity onPress={() => openDatePicker('start')}>
                    <Text
                      style={{
                        fontSize: width > 320 ? 15 : 14, // Adjust font size for smaller screens
                        fontWeight: '500',
                        marginVertical: 1, // Space between items
                      }}
                    >
                      Start Date:{' '}
                      <Text
                        style={{
                          fontSize: width > 320 ? 15 : 14, // Match font size with the label
                          fontWeight: '800',
                        }}
                      >
                        {startDate.toLocaleDateString()}
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => openDatePicker('end')}>
                    <Text
                      style={{
                        fontSize: width > 320 ? 15 : 14,
                        fontWeight: '500',
                        marginVertical: 1,
                      }}
                    >
                      End Date:{' '}
                      <Text
                        style={{
                          fontSize: width > 320 ? 15 : 14,
                          fontWeight: '900',
                        }}
                      >
                        {endDate.toLocaleDateString()}
                      </Text>
                    </Text>
                  </TouchableOpacity>
              </View>

              <View style={{ 
                flex: 1,
                flexDirection: 'row', 
                justifyContent: 'center', 
                columnGap: 5,
                height: '100%',
                width: '100%'
              }}>
                {/* <Button color='#566F48' title="Week" onPress={() => setSelectedPeriod('week')} />
                <Button color='#566F48' title="Month" onPress={() => setSelectedPeriod('month')} />
                <Button color='#566F48' title="Year" onPress={() => setSelectedPeriod('year')} /> */}
                {periods.map(period => (
                    // <Button 
                    //     key={period.value} 
                    //     color={navbuttonColor} 
                    //     title={period.title}
                    //     onPress={() => setSelectedPeriod(period.value)} 
                    // />
                    <TouchableOpacity
                      key={period.value}
                      style={[
                          TransactionScreenStyles.datebutton, // Add your button styles here
                          { backgroundColor: navbuttonColor }, // Set the background color
                      ]}
                      onPress={() => setSelectedPeriod(period.value)}
                      activeOpacity={0.7} // Optional: Adjust opacity for touch feedback
                    >
                      <Text style={TransactionScreenStyles.buttonText}>{period.title}</Text>
                    </TouchableOpacity>
                ))}
              </View>

            </View>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View style={TransactionScreenStyles.infoContainer}>
                <Text style={TransactionScreenStyles.infoText}>
                  Farm Name: {farmBranchName}
                </Text>
                  
                  <View style={{gap: 3, flexDirection: 'column'}}>
                    
                    <View style={{marginTop:3, marginBottom: 5, width: 180}}>
                      <Text style={TransactionScreenStyles.subHeaderText}>Total Balance: </Text>
                      <Text style={TransactionScreenStyles.totalBalanceText}>PHP {formatBalance(totalBalance)}</Text>
                    </View>

                    <View style={{flexDirection: 'row',}}>
                      <View style={{flex:1.25}}>
                        <Text style={TransactionScreenStyles.subHeaderText}>Total Income:</Text>
                        <Text style={TransactionScreenStyles.totalIncomeText}>PHP {formatBalance(totalIncome)}</Text>
                      </View>

                      <View style={{flex:1}}>
                        <Text style={TransactionScreenStyles.subHeaderText}>Total Expense:</Text>
                        <Text style={TransactionScreenStyles.totalExpenseText}>PHP {formatBalance(totalExpense)}</Text>
                      </View>
                    </View>

                  </View>
              </View>
            </ScrollView>
          </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={TransactionScreenStyles.scrollView}>
      <View style={TransactionScreenStyles.buttonContainer}>
    
      <TouchableOpacity
        style={[
          TransactionScreenStyles.button,
          showMoneyIn ? TransactionScreenStyles.activeButtonIn : TransactionScreenStyles.inactiveButton,
        ]}
        onPress={handleShowMoneyIn}
        activeOpacity={1}
          >
          <Text style={TransactionScreenStyles.buttonText}>Show all Money In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            TransactionScreenStyles.button,
            showAllTransactions ? TransactionScreenStyles.activeButtonAll : TransactionScreenStyles.inactiveButton,
          ]}
          onPress={handleShowAllTransactions}
          activeOpacity={1}
        >
          <Text style={TransactionScreenStyles.showAllButtonText}>Show All Records</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            TransactionScreenStyles.button,
            showMoneyOut ? TransactionScreenStyles.activeButtonOut : TransactionScreenStyles.inactiveButton,
          ]}
          onPress={handleShowMoneyOut}
          activeOpacity={1}
        >
          <Text style={TransactionScreenStyles.buttonText}>Show all Money Out</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={TransactionScreenStyles.body}>
          <View style={{ alignItems: 'center', marginBottom: 20,}}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 10,}}>
                {selectedPeriod === 'week'
                    ? 'Weekly Transactions'
                    : selectedPeriod === 'month'
                    ? `${new Date().toLocaleString('default', { month: 'long' })} Transactions`
                    : 'Yearly Transactions'}
            </Text>
              <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false} 
              style={{borderRadius: 12,}}>
                <View style={{ alignItems: 'center', marginVertical: 0, paddingVertical: 0}}>
                  <BarChart
                    data={{
                      labels: barChartData.labels, // Always show labels
                      datasets: 
                        showMoneyIn && showMoneyOut
                          ? barChartData.datasets // Show both datasets
                          : showMoneyIn
                          ? [barChartData.datasets[0]] // Show only Money In
                          : [barChartData.datasets[1]], // Show only Money Out
                    }}
                    width={Dimensions.get('window').width}
                    height={222}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                      },
                    }}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    barPercentage={0.4}
                    groupBarsPercentage={0.8}
                    withInnerLines={false}
                  />
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
        </View>
      </ScrollView>
        
      <View style={{paddingHorizontal: 20, marginBottom: 15}}>
        <TouchableOpacity style={TransactionScreenStyles.pdfButton} onPress={generatePDF}>
          <Text style={TransactionScreenStyles.pdfButtonText}>Generate PDF</Text>
        </TouchableOpacity>
          {/* Modal for adding or editing pig group 
        <TouchableOpacity style={TransactionScreenStyles.backButton} onPress={handleGoBack}>
          <Text style={TransactionScreenStyles.backButtonText}>Back</Text>
        </TouchableOpacity>*/}
      </View>

      
    </SafeAreaView>
  );
};

export default TransactionScreen;