import { StyleSheet } from 'react-native';

const PigDetailsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7c796',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Darker text color for better contrast
  },
  pigInfo: {
    fontSize: 16,
    color: '#000',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    fontWeight: '450',
  },
  header: {
    backgroundColor: '#fefefe',
    flexDirection: 'column', 
    rowGap: 5,
    borderRadius: 15,
    padding: 10,
  },
  headerContainter: {
    rowGap: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  header_box1: {
    flexDirection: 'row',
    // columnGap: 15,
  },
  header_box2: {
    flexDirection: 'row',
    // columnGap: 80,
  },
  searchContainer: {
    flex: 3,
    alignSelf: 'center',
    // backgroundColor: 'lightblue',
    flexDirection: 'row',
    columnGap: 10,
    // width: '95%',
  },
  searchInput: {
    // flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
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
  },
  searchText: {
    flex: .9,
    fontSize: 20,
    fontWeight: '700',
    color: '#000000FF',
    alignSelf: 'center',
    textAlign: 'center',
    // backgroundColor: 'red'
  },
  pigContainer: {
    flex: 1,
    margin: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // White background for pig cards
   
    shadowColor: '#000', // Shadow for pig cards
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  detail: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  assignedText: {
    fontSize: 16,
    color: '#D9534F', // Bootstrap danger color for warnings
    textAlign: 'center',
    marginTop: 4,
  },
  selectButton: {
    backgroundColor: '#074799',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#399918', // Success color for selected button
  },
  disabledButton: {
    backgroundColor: '#B0BEC5', // Disabled button color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500', // Medium weight for button text
  },
  backImage: {
    width: 30, // Adjust size as needed
    height: 20, // Adjust size as needed'
  },
  savedbuttonContainer: {
    // flex: 1,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    bottom: 5,
    marginTop: 15,
  },
  saveButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#566F48',
    borderRadius: 20,
    paddingHorizontal: 3,
    insetBlockStart: -10,
  },
  savebuttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#F5F5F5',
    textTransform: 'uppercase',
  },
});

export default PigDetailsScreenStyles;