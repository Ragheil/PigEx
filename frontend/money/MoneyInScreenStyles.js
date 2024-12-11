import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7c796', // Light background color
  },
  headercontainer: {
    width: '100%',
    backgroundColor: '#869f77',
    paddingBottom: 5,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.25,
  },
  dateGroup: {
    // backgroundColor: 'red',
    paddingHorizontal: 20,
  },
  dateHeader: {
    // paddingTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  record: {
    paddingTop: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    // marginVertical: 5,
    borderWidth: 2,
    borderColor: '#ced4da',
    // borderRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    marginBottom: 5,
  },
  recordText: {
    fontSize: 16,
    color: '#212529',
  },
  recordTextAmount: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 5,
    color: '#0d0f0b',
    textAlign: 'center'
  },
  recordButtons: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: 10,
    columnGap: 5,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6e7f5b',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#a95d5d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#ced4da',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    color: '#495057',
  },
  dateButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  dateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#ffffff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    color: '#495057',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addbuttonContainer: {
    // flex: 1,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginTop: 5,
    bottom: 5,
  },
  addMoneyButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#566F48',
    borderRadius: 20,
    paddingHorizontal: 3,
    insetBlockStart: -10,
  },
  addMoneyButtonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#F5F5F5',
    textTransform: 'uppercase',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',  // Center the modal vertically
    alignItems: 'center',      // Center the modal horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalButtons: {
    rowGap: 5,
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: '80%',  // You can adjust the width as needed
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  balanceNumber: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#f8fff0',  // Green color for balance
    // marginVertical: 10,
    textAlign: 'center',
    letterSpacing: 0.5,  // Slight letter spacing for a clean look
  },
  balance: {
    fontSize: 22,
    fontWeight: '500',
    color: '#f8fff0',  // Green color for balance
    // marginVertical: 10,
    textAlign: 'center',
    letterSpacing: 0.5,  // Slight letter spacing for a clean look
  },
  farmName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#191919',  // Dark grey color for text
    // marginVertical: 5,
    textAlign: 'center',
    fontStyle: 'italic',  // Italicize to add a subtle style
    // backgroundColor: 'red'
    marginBottom: 10,
  },
});
