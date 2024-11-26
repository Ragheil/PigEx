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
    // height: 20,
    // padding: 20,
    // backgroundColor: '#869f77',
    backgroundColor: '#a7c796',
    // backgroundColor: 'red',
  },
  header: {
    // flex: 1,
    paddingTop: 30,
    paddingHorizontal: 13,
    paddingBottom: 12,
    backgroundColor: '#869f77',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 5,
    // backgroundColor: 'lightblue',
  },
  infoHeader: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    backgroundColor: '#F5F5F5',
    // paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
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
    borderBottomStartRadius:5,
    borderBottomEndRadius: 5,
    elevation: 3,
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
  
});

export default TransactionScreenStyles;
