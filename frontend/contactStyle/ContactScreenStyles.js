// ContactScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: '#a7c796',
    },
    navheader: {
      flexDirection: 'row',
      marginBottom: 15,
      // backgroundColor: 'lightblue',
    },
    headerContainer: {
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 25,
      columnGap: 5,
    },
    searchcontainer: {
      flex: 1,
      flexDirection: 'row', // Align items in a row
      alignItems: 'center', // Center items vertically
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      // margin: 10,
      backgroundColor: 'lightblue',
    },
    searchInput: {
      height: 40,
      width: '100%',
      // borderColor: '#ddd',
      // borderWidth: 1,
      paddingLeft: '15%',
      backgroundColor: '#F5F5F5',
    },
    input: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    tableHeader: {
      fontSize: 20,
      marginVertical: 16,
    },
    contactheader: {
      backgroundColor: '#869f77',
      width: '100%',
      padding: 5,
      paddingLeft: 10,
      fontSize: 20,
      fontWeight: '500',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    contactItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      // borderBottomColor: '#ddd',
      // borderBottomWidth: 1,
      backgroundColor: '#F5F5F5',
      borderRadius: 22,
    },
    contactItemSwiped: {
      // borderRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    contactInfo: {
      flex: 1,
      paddingRight: 10,
    },
    contactNumber: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    contactName: {
      fontSize: 16,
      color: '#555',
    },
    contactText: {

    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionIcon: {
      width: 36,
      height: 36,
      marginHorizontal: 8,
    },
    deleteButtonSwiped: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    deleteButton: {
      backgroundColor: '#F44336',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: 67.4,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 22,
      borderBottomRightRadius: 22,
      
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalheader: {
      paddingLeft: 10,
      padding: 5,
      width: '100%',
      fontSize: 20,
      fontWeight: 'bold',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: '#869f77',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 40,
    },
    modalView: {
      backgroundColor: 'white',
      padding: 20,
      width: '100%',
      shadowColor: '#000',
      borderStartEndRadius: 10,
      borderEndEndRadius: 10,
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      rowGap: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      // alignItems: 'center',
      // backgroundColor: 'lightblue',
      justifyContent: 'flex-end',
      columnGap: 10,
      width: '100%',
      marginTop: 5,
      
    },
    title: {
      flex: 1.90,
      fontWeight: 'bold',
      fontSize: 28,
      textAlign: 'left',
      alignSelf: 'center',
    }, 
    backButton: {
      flex: 1,
      justifyContent: 'center',

    },

    //icon & images
    iconsearch: {
      width: 25, // Set your icon width
      height: 25, // Set your icon height
      position: 'absolute', // Position the icon absolutely
      zIndex: 1,
      marginLeft: 5,
      opacity: .5,
    },
    backImage: {
      width: 30, // Adjust size as needed
      height: 20, // Adjust size as needed
    },
});
