// ContactScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#a7c796',
      },
      mainheader: {
        paddingHorizontal: 10,
        paddingBottom: 10,
        flexDirection: 'culomn',
        backgroundColor: '#869f77',
        alignItems: 'center',
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25
      },
      navibackButton: {
        // padding: 10,
        // marginRight: 5, // Space between the back button and the title
        // paddingTop: 45,
        flex: 1,
        justifyContent: 'center',
      },
      backImage: {
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
      },
      headerText: {
        flex: 2,
        fontSize: 28,
        fontWeight: 'bold',
        alignSelf: 'center',
        // marginBottom: 10,
        // marginTop: 5,
        // backgroundColor: 'lightblue',
      },
      body: {
        flex: 7,
        // paddingTop: 15,
        padding: 5,
        paddingBottom: 20,
        // backgroundColor: 'lightblue',
        // backgroundColor: '#566F48',
      },
      backButton: {
        padding: 10,
        marginRight: 5, // Space between the back button and the title
        paddingTop: 45

      },
      subheader: {
        backgroundColor: 'red',
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
      piglogobox: {
        // backgroundColor: 'lightblue',
        // flex: 1,
        // flexWrap: 'wrap',
        // height: '20%',
        // width: '100%',
        // height: 150,
        // width: 150,
        // height: width * 0.5,
        // width: width * 0.5,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        
      },
      pigLogo: {
        // flex: 1,
        // width: '100%',
        // height: '100%',
        // backgroundColor: 'lightgreen',
        height: 60,
        width: 150,
        resizeMode: 'contain',
      },
      appname: {
        // fontFamily: 'BakbakOne-Regular',
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        // fontFamily:
        textTransform: 'uppercase',
      },
      farmname: {
        fontWeight:'900', 
        textTransform: 'uppercase',
        fontSize: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        // marginTop: 60
      },
      searchAndAddContainer: {
        // backgroundColor: 'lightblue',
        flexDirection: 'row',
        columnGap: 10,
      },
      searchInput: {
        // flex: 1,
        width: '95%',
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 14,
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
      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-evenly',
        // justifyContent: 'flex-start',
        // justifyContent: 'space-around',
        // justifyContent: 'center',
        justifyContent: 'space-between',
        // gap: 10,
        rowGap: 25,
        paddingHorizontal: 20,
        // backgroundColor: 'lightblue',
        
      },
      pigIcon: {
        width: 100,     // Set the width as needed
        height: 100,    // Set the height as needed
        // backgroundColor: 'lightblue',
        alignSelf: 'center',
      },
      pigGroupItem: {
        backgroundColor: '#F5F5F5',
        borderColor: '#566F48',
        borderRadius: 13,
        borderWidth: 4,
        padding: 15,
        // margin: 8,
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      pigGroupText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      pigCountText: {
        marginTop: 8,
        fontSize: 16,
      },
      boldText: {
        fontWeight: 'bold',
      },
      actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
      },
      icon: {
        width: 24,
        height: 24,
      },
      tableHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      buttonContainer: {
        // flex: 1,
        height: 60,
        width: '92%',
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
        fontSize: 20,
        fontWeight: '700',
        color: '#F5F5F5',
        textTransform: 'uppercase',
      },
      saveButton: {
        width: '100%',
        marginBottom: 8,
        marginTop: 50
      },
      cancelButton: {
        width: '100%',
      },
      pigCountText: {
        fontSize: 14,
        color: '#666', // Adjust color as needed
        marginTop: 4,
        fontSize: 18,
        fontWeight: 'bold'
      },

      //modal add pig group
      modalbox: {
        // backgroundColor: 'lightblue',
        flexDirection: 'column',
      },
      modalContent: {
        backgroundColor: '#F5F5F5',
        // backgroundColor: '#869f77',
        padding: 16,
        // borderRadius: 8,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        
      },
      modalTitle: {
        backgroundColor: '#869f77',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 7,
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
      },
      input: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 10,
        width: '100%',
        marginBottom: 15,
      },
      modalsavecancel: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        width: '100%',
        // backgroundColor: 'lightblue',
      },
      
});