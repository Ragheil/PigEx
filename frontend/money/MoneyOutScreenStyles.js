import { StyleSheet } from 'react-native';

const MoneyOutScreenStyles = StyleSheet.create({
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
  balanceNumber: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#6e1a22',
    textAlign: 'center',
    letterSpacing: 0.5,  // Slight letter spacing for a clean look
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFFFF',  // Red color for balance to match "Money Out"
    textAlign: 'center',
    letterSpacing: 0.5,  // Slight letter spacing for a clean look
  },
  farmName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#191919',  // Dark grey color for text
    textAlign: 'center',
    fontStyle: 'italic',  // Italicize for a subtle, stylish effect
    marginBottom: 10,
  },
  record: {
    paddingTop: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ced4da',
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
    marginTop: 10,
    columnGap: 5,
  },
  dateGroup: {
    // backgroundColor: 'red',
    paddingHorizontal: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6e7f5b', // Green for edit action
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#a95d5d', // Red for delete action
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007bff', // Blue for adding new entry
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 12,
    fontSize: 16,
    color: '#495057',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745', // Green for saving
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red for canceling
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  flatListItemText: {
    // marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'black', // Set border color to black
    borderWidth: 1, // Set border width
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default MoneyOutScreenStyles;
