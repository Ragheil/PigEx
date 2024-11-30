import { StyleSheet } from 'react-native';
import { auth } from '../../firebase/config2';

const TransactionScreenStyles = StyleSheet.create({
  // background: {
  //   flex: 1,
  //   resizeMode: 'cover', // optional, can also be 'contain', 'stretch', etc.
  //   justifyContent: 'center',
  // },
  container: {
    flex: 1,
    backgroundColor: '#a7c796',
  },
  navheader: {
    flexDirection: 'row',
    marginBottom: 15,
    // backgroundColor: 'lightblue',
  },
  navibackButton: {
    // padding: 10,
    // marginRight: 5, // Space between the back button and the title
    // paddingTop: 45,
    flex: 1,
    justifyContent: 'center',

  },
  backImage: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    
  },
  header: {
    // flex: 1,
    paddingTop: 30,
    paddingHorizontal: 13,
    paddingBottom: 12,
    backgroundColor: '#869f77',
    borderStartEndRadius: 25,
    borderEndEndRadius: 25,
  },
  headerText: {
    flex: 2.25,
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center'
    // marginBottom: 10,
    // marginTop: 5,
    // backgroundColor: 'lightblue',
  },
  infoHeader: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    backgroundColor: '#F5F5F5',
    // paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
  },
  infoContainer: {
    // marginBottom: 20,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    // borderRadius: 5,
    borderStartEndRadius:12,
    borderEndEndRadius: 12,
  },
  body: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 20,
    // backgroundColor: 'lightgreen',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 3,
  },
  subHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000CC',
    // marginTop: 10,
  },
  totalBalanceText: {
    fontSize: 25,
    fontWeight: '900',
    color: 'black',
    // width: 100
  },
  totalIncomeText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'green',
  },
  totalExpenseText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
  },
  transactionContainer: {
    marginBottom: 10,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  transactionLabel: {
    fontSize: 16,
  },
  categoryText: {
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 16,
  },
  income: {
    color: 'green',
  },
  expense: {
    color: 'red',
  },
  remarksText: {
    fontSize: 14,
    color: 'gray',
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  pdfButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#6c757d',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  scrollView: {
    height: 150, // Set your desired height for the ScrollView
   // marginBottom: 10, // Optional: Add margin if needed
  },
  scrollViewContent: {
    flexDirection: 'row', // Keep buttons in a horizontal layout
    alignItems: 'center', // Center items vertically within the ScrollView
  },
  buttonContainer: {
    flexDirection: 'row', // Keep buttons in a horizontal layout
    padding: 6,
  },
  button: {
    paddingVertical: 15, // Increase vertical padding for height
    paddingHorizontal: 20,
    borderRadius: 100,
    marginHorizontal: 5, // Space between buttons
  },
  activeButtonIn: {
    backgroundColor: 'green',
  },
  activeButtonOut: {
    backgroundColor: 'red',
  },
  inactiveButton: {
    backgroundColor: 'grey',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeButtonAll: {
    backgroundColor: '#FF5900FF',
  },
  showAllButtonText: {
    color: '#FFFFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default TransactionScreenStyles;
