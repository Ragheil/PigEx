import { StyleSheet } from 'react-native';

const MoneyOutScreenStyles = StyleSheet.create({
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
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#dc3545',  // Red color for balance to match "Money Out"
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
    fontStyle: 'italic',  // Italicize for a subtle, stylish effect
  },
  record: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ced4da',  // Soft border color for separation
    shadowColor: '#000', // Adding subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordText: {
    fontSize: 16,
    color: '#212529',  // Dark color for readability
    marginBottom: 6,
  },
  recordButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#28a745', // Green for edit action
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red for delete action
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
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
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default MoneyOutScreenStyles;
