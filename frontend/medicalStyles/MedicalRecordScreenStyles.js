import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Softer light background for contrast
  },
  title: {
    fontSize: 26, // Slightly larger font size for the title
    fontWeight: '700', // Use a bolder font weight
    marginBottom: 20,
    color: '#2c3e50', // Darker text for better readability
    textAlign: 'center', // Center align title
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
});

export default styles;