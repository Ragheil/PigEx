import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1, // Allow the content to grow
    padding: 16,
  },
  mainheader: {
    flexDirection: 'column',
    backgroundColor: '#869f77',
    paddingTop: 30,
    paddingBottom: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  subheader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  subbox1: {
    flex: 1,
    flexDirection: 'culomn',
  },
  subbox2: {
    backgroundColor:'#566F48',
    padding: 5,
    borderRadius:5,
    zIndex: 1,
  },
  appname: {
    fontSize: 45,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  piglogobox: {
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pigLogo: {
    height: 60,
    width: 150,
    resizeMode: 'contain',
  },
  pigIcon: {
    width: 90,     // Set the width as needed
    height: 90,    // Set the height as needed
    // backgroundColor: 'lightblue',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  pigGroupText: {
    fontSize: 18,
    color: '#333',
  },
  pigCountText: {
    fontSize: 16,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingHorizontal: 5,
    flexDirection: 'row', // Ensure items are laid out in a row

  },
  pigGroupSummary: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 13,
    padding: 10,
    borderColor: '#566F48',
    borderWidth: 4,
    shadowColor: '#869f77',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: .9,
    elevation: 10,
  },
  pigGroupText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pigCountText: {
    fontSize: 14,
    color: 'gray',
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  flatList: {
    flexGrow: 0, 
    paddingVertical: 8,
    width: '100%', // Ensure FlatList takes full width

  },
  button: {
    backgroundColor: '#566F48',
    borderRadius: 10, // Adjust the radius as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5, // Optional: add some margin between buttons
    alignItems: 'center',
},
buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Adjust font size as needed
    fontWeight: '500',
},
addButtonText: {
  fontWeight: '500',
  textAlign: 'center',
  color: '#F5F5F5',
},
  seeAllButton: {
    marginBottom: 20, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#869F77',
    borderRadius: 13,
    alignItems: 'center',
    zIndex: 1, 
    elevation: 2, 
  },
  seeAllText: {
    color: '#fff',
    fontSize: 18,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 10,
    elevation: 1,
  },
  sidebarHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 60,
  },
  sidebarDivider: {
    backgroundColor: '#869F77',
    height: 1,
    marginBottom: 20,
  },
  sidebarText: {
    fontSize: 18,
    marginBottom: 20,
  },
  sidebarButton: {
 backgroundColor: '#869F77',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  sidebarButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  sidebarHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  accountButton: {
    backgroundColor: '#869F77',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 60,
  },
  accountButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%', // Width of the modal
    backgroundColor: 'white', // Background color of the modal
    borderRadius: 10, // Rounded corners
    padding: 20, // Padding inside the modal
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
    columnGap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#869F77',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  addBranchButton: {
    backgroundColor: '#869F77',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 13,
  },
  addBranchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF0000FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 13,
    position: 'static',
    bottom: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  horizontalLine: {
    marginVertical: 10, // Space above and below the line
    height: 1, // Height of the line
    backgroundColor: '#000', // Color of the line
    width: '100%', // Full width of the container
    marginTop: '100%', //
    position: 'static',
    bottom: 5,
},
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  modalContent: {
    width: '80%', // Width of the modal
    backgroundColor: 'white', // Background color of the modal
    borderRadius: 10, // Rounded corners
    padding: 20, // Padding inside the modal
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 4, // Shadow radius for iOS
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Center the title text
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  confirmButton: {
    backgroundColor: '#3476BDFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#3476BDFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#E5791AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  updateEmailButton: {
    backgroundColor: '#1417CCFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  closeModalButton: {
    backgroundColor: '#BD4D34FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FAFAFAFF',
    fontWeight: 'bold',
  },
  closeModalText: {
    color: '#FFFFFFFF',
    textAlign: 'center',
  },
  updateButtonText: {
    color: '#FFFFFFFF',
    textAlign: 'center',
    
  },
});

export default styles;