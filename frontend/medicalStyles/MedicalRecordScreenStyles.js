import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: '#a7c796', // Softer light background for contrast
  },
  title: {
    fontSize: 26, // Slightly larger font size for the title
    fontWeight: '700', // Use a bolder font weight
    marginBottom: 20,
    color: '#2c3e50', // Darker text for better readability
    textAlign: 'center', // Center align title
  },
  mainheader: {
    backgroundColor: '#869f77',
    paddingHorizontal: 15,
    // paddingTop: 30,
    paddingBottom: 10,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    elevation: 10,
    // rowGap: 15,
  },
  navibackButton: {
    // padding: 10,
    // marginRight: 5, // Space between the back button and the title
    // paddingTop: 45,
    // flex: 1,
    justifyContent: 'center',
  },
  backImage: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    // backgroundColor: 'lightblue',
  },
  headerText: {
    flex: 3,
    fontSize: 28,
    fontWeight: 'bold',
    alignSelf: 'center', 
    // marginBottom: 10,
    // marginTop: 5,
    // backgroundColor: 'lightblue',
  },
  searchContainer: {
    // backgroundColor: 'lightblue',
    flexDirection: 'row',
    // justifyContent: 'center',
    // justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
    columnGap: 10,
  },
  searchInput: {
    // flex: 1,
    width: '100%',
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
    // padding: 8,
    paddingLeft: 30,
  },
  iconsearch: {
    width: 25, // Set your icon width
    height: 25, // Set your icon height
    position: 'absolute', // Position the icon absolutely
    zIndex: 1,
    marginLeft: 5,
    opacity: .5,
    alignSelf: 'center',
    // backgroundColor: 'red'
  },
  recordItem: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#dcdcdc', // Lighter border color
    borderRadius: 12, // More pronounced rounded corners
    backgroundColor: '#ffffff', // White background for each record
    shadowColor: '#000', // Adding shadow for depth
    shadowOffset: {
      width: 0,
      height: 4, // Slightly increased shadow height for a more lifted effect
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3, // For Android shadow
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff', // White background for modal
    borderRadius: 12, // More pronounced rounded corners for modal
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24, // Slightly larger font size for modal title
    marginBottom: 20,
    color: '#27ae60', // Softer green color for title
    textAlign: 'center',
    fontWeight: '600', // Semi-bold font weight
  },
  input: {
    borderWidth: 1,
    borderColor: '#27ae60', // Softer green border for inputs
    marginBottom: 15,
    padding: 12, // Slightly increased padding for better touch targets
    borderRadius: 8, // More rounded corners
    backgroundColor: '#ecf0f1', // Light gray background for inputs
    fontSize: 16, // Increased font size for better readability
  },
  button: {
    backgroundColor: '#27ae60', // Softer green button background
    borderRadius: 8, // More rounded corners
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  buttonText: {
    color: '#ffffff', // White text for buttons
    fontSize: 18, // Slightly larger font size
    fontWeight: '600', // Semi-bold font weight
  },
  deleteButton: {
    backgroundColor: '#e74c3c', // Softer red background for delete button
    borderRadius: 8, // More rounded corners
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 18, // Slightly larger font size
    fontWeight: '600', // Semi-bold font weight
  },
  buttonContainer: {
    // flex: 1,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    // backgroundColor: 'red',
    // height: 70,
    // marginBottom: 20,
    // marginHorizontal: 10,
    // position: 'relative',
    bottom: 5,
    // justifyContent: 'flex-end',
    // paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#566F48',
    borderRadius: 20,
    paddingHorizontal: 3,
    insetBlockStart: -10,
  },
  addButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#F5F5F5',
    textTransform: 'uppercase',
    lineHeight: 20, // Adjust the line height to your preference
  },
  groupnameContainer: {
    backgroundColor: '#869f77',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    // borderTopStartRadius: 22,
    // borderTopRightRadius: 22,
    // borderBottomLeftRadius: 3,
    // borderBottomEndRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 3,
  },
  groupname:{
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    // backgroundColor: 'lightblue'
    
  },
  groupNametext: {
    flex: 3,
    // alignContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  groupNamevalue: {
    // alignContent: 'center',
    // alignSelf: 'center',
    // alignItems: 'center',
    textAlign: 'center',
    // backgroundColor: 'red'
  },
});

export default styles;