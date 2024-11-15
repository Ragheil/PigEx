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
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20,
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 4,
        // padding: 8,
        paddingLeft: 10,
        marginLeft: 8,
      },
      grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
<<<<<<< HEAD
        justifyContent: 'flex-start',
        alignItems: 'center',
=======
        // justifyContent: 'space-evenly',
        // justifyContent: 'flex-start',
        // justifyContent: 'space-around',
        // justifyContent: 'center',
        justifyContent: 'space-between',
        // gap: 10,
        rowGap: 25,
        paddingHorizontal: 20,
        // backgroundColor: 'lightblue',
>>>>>>> 0a23459bc0a98e9d3df96c7f1de9796f6b6a3291
        
      },
      pigIcon: {
        width: 100,     // Set the width as needed
        height: 100,    // Set the height as needed
        marginBottom: 5,
        // backgroundColor: 'lightblue',
        alignSelf: 'center',
      },
      pigGroupItem: {
<<<<<<< HEAD
        backgroundColor: '#fff',
        borderColor: '#566F48',
        borderRadius: 8,
        borderWidth: 3,
        padding: 16,
        margin: 8,
=======
        backgroundColor: '#F5F5F5',
        borderColor: '#566F48',
        borderRadius: 13,
        borderWidth: 4,
        padding: 15,
        // margin: 8,
>>>>>>> 0a23459bc0a98e9d3df96c7f1de9796f6b6a3291
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
      modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        // padding: 8,
        width: '100%',
        // marginBottom: 16,
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

<<<<<<< HEAD

});
=======
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
>>>>>>> 0a23459bc0a98e9d3df96c7f1de9796f6b6a3291
