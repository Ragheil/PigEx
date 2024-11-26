// ContactScreenStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
      },
      headerContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 15,
        columnGap: 5,
      },
      searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 8,
      },
      header: {
        fontSize: 24,
        marginBottom: 16,
        fontWeight: 'bold', // Makes the text bold

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
      contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
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
      actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      actionIcon: {
        width: 36,
        height: 36,
        marginHorizontal: 8,
      },
      deleteButton: {
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderRadius: 10,
      },
      deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        
      },
      title: {
        fontWeight: 'bold', // Makes the text bold
        fontSize: 45, // Adjusts the font size for better visibility
        textAlign: 'left', // Ensures text alignment is centered
        marginTop: 1, // Adds some space below the title
      }, 
      backButton: {
        padding: 10,
        marginRight: 5, // Space between the back button and the title
        paddingTop: 45

      },
      backImage: {
        width: 50, // Adjust size as needed
        height: 50, // Adjust size as needed
        paddingTop: 4
      },
});
