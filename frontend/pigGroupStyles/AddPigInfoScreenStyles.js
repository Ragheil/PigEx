import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a7c796',
        
      },
      mainheader: {
        backgroundColor: '#869f77',
        paddingHorizontal: 15,
        paddingTop: 30,
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
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        // marginBottom: 10,
        marginTop: 1,
    
      },
      filterButtonContainer: {
        flexDirection: 'row',
        paddingVertical: 5, // Reduced vertical padding
        paddingHorizontal: 15,
        marginBottom: 5, // Reduced margin
        justifyContent: 'center'
      },
      buttonPigInfo: {
        flex: 1,
        borderRadius: 13, // Reduced border radius
        padding: 7, // Reduced padding
        marginHorizontal: 2, // Reduced margin
        borderWidth: 3,
      },
      buttonAlive: {
        borderColor: '#566F48',
        backgroundColor: '#F28585B3',
      },
      buttonDeceased: {
        borderColor: '#566F48',
        backgroundColor: '#FF0000B3',
      },
      buttonAll: {
        borderColor: '#566F48',
        backgroundColor: '#FFA500B3',
      },
      buttonSold: {
        borderColor: '#566F48',
        backgroundColor: '#008000B3',
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
      buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '900',
        color: '#F5F5F5',
        textTransform: 'uppercase',
        lineHeight: 20, // Adjust the line height to your preference
      },
      buttonDeceasedText: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '900',
        color: '#F5F5F5',
        textTransform: 'uppercase',
        lineHeight: 17, // Adjust the line height to your preference
      },
      datePickerButton: {
        backgroundColor: '#B1C68CFF', // Green background
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
      },
      datePickerText: {
        color: '#000000FF', // White text color
        fontSize: 16,
      },
      // addButtonText: {
      //   color: '#399918', // Text color
      //   fontSize: 16,
      //   fontWeight: 'bold',
      // },
      list: {
        flex: 1,
      },
      listContent: {
        // backgroundColor: 'lightyellow',
        paddingBottom: 20,
        paddingHorizontal: 16,
      },
      pigContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 10,
        marginHorizontal: 5,
        // borderBottomWidth: 1,
        // borderBottomColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        borderRadius: 22,
      },
      pigInfo: {
        flex: 1,
      },
      pigText: {
        fontSize: 16,
        marginBottom: 5,
      },
      actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
      },
      iview:{
        width: 28,
        height: 28,
      },
      iedit: {
        width: 23,
        height: 23,
      },
      idelete: {
        width: 24,
        height: 24,
      },
      picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      pregnancyButton: {
        backgroundColor: '#FFA500', // Orange color for pregnancy records button
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
      },
      switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
      },      
      titlename: {
        paddingLeft: 3,
        marginBottom: 3,
        // backgroundColor: 'lightblue',
      },
      detailText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000FF',
      },
      ammountLossText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F10000FF',
      },

      ammountSoldText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000FF',
      },


      //modal
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080',
      },
      modalbox: {
        padding: 20,
      },
      modalTitle: {
        width: '80%',
        backgroundColor: '#869f77',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 7,
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: '80%',
        rowGap: 3,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      modalsavecancel: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        gap: 10,
        width: '70%',
        // backgroundColor: 'lightblue',

      },
      deceasedPigContainer: {
        backgroundColor: '#D3D3D3', // Light gray background for deceased pigs
      },
      deceasedText: {
        color: 'red', // Red color for deceased label
      },
      backButton: {
        padding: 10,
        marginRight: 5, // Space between the back button and the title
        paddingTop: 45

      },
      isold: {
        width: 24, 
        height: 24, 
        marginRight: 3, 
      },
      soldPigContainer: {
        backgroundColor: '#D3D3D3', // Light gray background
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
      },
      soldText: {
        color: '#008000', // Green text color
        fontWeight: 'bold',
      },
});
