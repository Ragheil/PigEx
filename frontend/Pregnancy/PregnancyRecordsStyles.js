import { StyleSheet } from 'react-native';

const PregnancyRecordsStyles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  groupName: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  pigName: { fontSize: 16, marginBottom: 5 },
  pigContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: { width: 24, height: 24, marginRight: 10 },
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },

  // Modal Background and Container (Common)
  modalBackground: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContainer: { 
    width: '80%',  // Adjust width to make modal more responsive
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Add Breeding Date Modal Specific Styles
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  pigNameInModal: { 
    fontSize: 18, 
    marginBottom: 20, 
    color: '#555' 
  },
  // Updated breeding date button style (Orange background)
  dateButton: { 
    marginBottom: 20, 
    padding: 10, 
    backgroundColor: '#FF9800',  // Orange background color
    borderRadius: 5, 
    width: '80%', 
    alignItems: 'center', 
  },
  dateText: { 
    color: '#fff', 
    fontSize: 18 
  },
  inputField: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  // Remarks TextInput
  remarksInput: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },

  // Button Styles
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },

  closeButton: {
    color: '#FF5733', 
    marginTop: 20, 
    textAlign: 'center', 
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  // For Piglets Modal
  pigletName: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  noPigletsText: { 
    fontSize: 16, 
    fontStyle: 'italic', 
    color: 'gray' 
  },

  // Styles for displaying piglets under each pig
  pigletContainer: { 
    marginTop: 10, 
    paddingLeft: 20, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 5, 
    marginBottom: 15 
  },
  pigletList: {
    fontSize: 50,
    marginBottom: 5,
    color: '#555',
  },
});

export default PregnancyRecordsStyles;
