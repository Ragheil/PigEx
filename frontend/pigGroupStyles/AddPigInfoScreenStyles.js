// ContactScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
      },
      mainheader: {
        backgroundColor: '#869f77',
        paddingHorizontal: 20,
        // paddingTop: 10,
        rowGap: 15,
      },
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        // marginBottom: 10,
        marginTop: 40,
    
      },
      groupName: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
      },
      searchContainer: {
        marginBottom: 20,
        padding: 20,
      },
      searchInput: {
        borderWidth: 2,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
      },
      addButton: {
        marginBottom: 5,
        backgroundColor: '#DCFFB7',
        padding: 10,

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
        paddingBottom: 20,
        paddingHorizontal: 16,
      },
      pigContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
      
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
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
});
