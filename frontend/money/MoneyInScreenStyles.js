import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateGroup: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e9ecef', // Light grey background for date groups
    borderRadius: 8,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  record: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  recordText: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  recordButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',  // Center the modal vertically
    alignItems: 'center',      // Center the modal horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
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
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',  // Green color for balance
    marginVertical: 10,
    textAlign: 'center',
    letterSpacing: 0.5,  // Slight letter spacing for a clean look
  },
  farmName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#495057',  // Dark grey color for text
    marginVertical: 5,
    textAlign: 'center',
    fontStyle: 'italic',  // Italicize to add a subtle style
  },
});
