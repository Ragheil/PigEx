// ContactScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    container1: {
        flex: 1,
        // padding: 16,
        backgroundColor: '#F5F5F5',
      },
      container2: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
        // backgroundColor: '#566F48',
      },
      mainheader: {
        flexDirection: 'column',
        backgroundColor: '#869f77',
        paddingTop: 40,
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
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 16,
      },
      searchInput: {
        flex: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 4,
        // padding: 8,
        paddingLeft: 10,
        marginLeft: 8,
      },
      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-evenly',
        // justifyContent: 'flex-start',
        // justifyContent: 'space-around',
        gap: 20,
        columnGap: 32,
        paddingHorizontal: 25,
        // backgroundColor: 'lightblue',
        
      },
      pigIcon: {
        width: 100,     // Set the width as needed
        height: 100,    // Set the height as needed
        // backgroundColor: 'lightblue',
        alignSelf: 'center',
      },
      pigGroupItem: {
        backgroundColor: '#FAF7F0',
        borderColor: '#566F48',
        borderRadius: 13,
        borderWidth: 3,
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
      
      addButton: {
        width: '100%',
        marginBottom: 8,
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
        backgroundColor: '#FAF7F0',
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
