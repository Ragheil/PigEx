
import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  contentContainer: {
    // backgroundColor: 'green',
    flex: 4,
    padding: 16,
  },
  mainheader: {
    flexDirection: 'column',
    backgroundColor: '#869f77',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  subheader: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  subbox1: {
    flex: 1,
    flexDirection: 'culomn',
    // backgroundColor: 'blue',
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
    // fontFamily:
  },
  title: {
    // backgroundColor: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // marginTop: 60,
    textAlign: 'center',
  },
  pigGroupSummary: {
    padding: 15,
    marginVertical: 10,
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 150,
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
    paddingHorizontal: 10, // Add horizontal padding to the list
  },
  pigGroupSummary: {
    width: 150, // Set a fixed width for each item
    marginRight: 10, // Spacing between items
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    backgroundColor: '#f0f0f0', // Background color for each item
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside each item
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
    
  },
  seeAllButton: {
    marginBottom: 20, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#869F77',
    borderRadius: 5,
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
    zIndex: 10, // Ensure the sidebar has the highest zIndex
    elevation: 10, // Higher elevation to ensure it shows above other UI elements
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
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
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
  },
  addBranchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default styles;
