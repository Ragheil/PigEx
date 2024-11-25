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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
  breedingHistoryModalContainer: {
    width: '90%', // Make the modal wider
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  noBreedingHistoryText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  breedingHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    },
  // Container to place Breeding Date and Remarks side by side
  breedingHistoryTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breedingHistoryLabel: {
    fontWeight: 'bold',
    width: '45%', // Adjust width to make them fit on the same line
    marginRight: 10, // Space between the two labels
    flex: 1,
    fontSize: 16,
  },
  editButtonText: {
    color: 'blue',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pigletModalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pigletModalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#566F48',
    marginBottom: 15,
    textAlign: 'center',
  },
  pigletsList: {
    width: '100%',
    maxHeight: 200,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  pigletText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  noPigletsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    paddingVertical: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#869F77',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pigletCountText: {
    fontSize: 16, // Adjust size as needed
    fontWeight: 'bold', // Make it bold for emphasis
    marginBottom: 10, // Space below the count
    color: '#333', // Darker color for better readability
  },

});

export default PregnancyRecordsStyles;
