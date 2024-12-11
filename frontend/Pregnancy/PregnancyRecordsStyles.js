import { StyleSheet } from 'react-native';

const PregnancyRecordsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7c796', // Light gray background for the main container
  },
  scrollContainer: {
    flex: 1,
    // backgroundColor: '#a7c796'
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000FF',
  },
  headercontainer: {
    backgroundColor: 'red'
  }, 
  piglogobox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  piglogo: {
    height: 70,
    width: 180,
    resizeMode: 'contain',
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000FF',
    marginVertical: 10,
  },
  pigName: {
    paddingVertical: 5,
    fontSize: 18,
    fontWeight: 'bold', // Ensure emphasis on the pig name
    color: '#333',
    textAlign: 'center', // Optional: center-align the pig name
    borderRadius: 8,
    backgroundColor: '#F5F5F5',

    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  pigContainer: {
    rowGap: 8,
    padding: 12,
    // marginVertical: 8,
    borderRadius: 20,
    backgroundColor: '#D4E1CDFF', 
    borderWidth: 1,
    borderColor: '#566F48',
    marginBottom: 15,

    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, // Space between pig content and buttons
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    // backgroundColor: 'red'
  },
  viewIcon: {
    width: 50,
    height: 50,
    // marginRight: 60,
    // position: 'relative',
    // right: -30, //
  },
  viewPiglet_IconColor: {
    tintColor: '#FF8E00'
  },
  addPiglet_IconColor: {
    tintColor: '#799351'
  },
  addBreedingDate_IconColor: {
    tintColor: '#D54062'
  },
  horizontalLine: {
    width: '100%', // Full width of the container
    height: 1,     // Thin horizontal line
    backgroundColor: '#000000FF', // Light gray color
    marginTop: 4,  // Space between the pig name and the line
    alignSelf: 'center', // Center the line horizontally
    marginBott: 4,
  },
  iconLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000000FF', // Slightly muted color for the label
   // marginTop: 4, // Space between the image and label
    textAlign: 'center',
  },
  buttonEdits: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    // borderWidth: 3,
    padding: 3,
    
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  viewPigletsButton: {
    backgroundColor: '#F5F5F5',
    // backgroundColor: '#a7c796',
    // borderColor: '#EEE2B5',
  },
  addPigletsButton: {
    backgroundColor: '#F5F5F5',
    // backgroundColor: '#a7c796',
    // borderColor: '#D7B26D',
  },
  addBreedingDateButton: {
    backgroundColor: '#F5F5F5',
    // backgroundColor: '#a7c796',
    // borderColor: '#566F48',
  },
addButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  // Adjust this value to move the text slightly to the left
},
  addBreedingDateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Modal Background and Container
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
  pigletCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    color : 'gray',
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
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  breedingHistoryModalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  noBreedingHistoryText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  breedingHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  breedingHistoryTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breedingHistoryLabel: {
    fontWeight: 'bold',
    width: '45%',
    marginRight: 10,
    flex: 1,
    fontSize: 16,
  },
  viewBreedingHistoryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  
  viewBreedingHistoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  remarksInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },

  backImage: {
    width: 28, // Adjust size as needed
    height: 20, // Adjust size as needed
  },



  
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  selectedPigName: {
    fontSize: 18,
    color: '#000000FF',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  
  dateButton: {
    backgroundColor: '#E9AF92FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  
  remarksInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  
  addButton: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  viewBreedingHistoryButton: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  
  viewBreedingHistoryText: {
    color: '#fff',
    fontSize: 16,
  },
  
  closeButton: {
    backgroundColor: '#D9534F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default PregnancyRecordsStyles;