import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Light background color
  },
  title: {
    fontSize: 26, // Increased font size for better readability
    fontWeight: '700', // Bold font weight for title
    marginBottom: 20,
    color: '#333', // Darker text color for better contrast
    marginTop: 60,
  },
  branchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15, // Increased padding for better touch targets
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc', // Lighter border color
  },
  branchName: {
    fontSize: 18, // Increased font size for better readability
    color: '#333', // Darker text color for better contrast
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 28, // Increased icon size for better visibility
    height: 28,
    marginLeft: 15, // Increased margin for better spacing
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12, // Increased corner radius for a more modern look
    padding: 25, // Increased padding for better spacing
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22, // Increased font size for better readability
    marginBottom: 15, // Increased margin for better spacing
    color: '#333', // Darker text color for better contrast
  },
  input: {
    height: 45, // Increased input height for better touch targets
    borderColor: '#dcdcdc', // Lighter border color
    borderWidth: 1,
    width: '100%',
    marginBottom: 15, // Increased margin for better spacing
    paddingHorizontal: 15, // Increased padding for better spacing
    fontSize: 18, // Increased font size for better readability
  },
  button: {
    backgroundColor: '#4CAF50', // Green button background
    borderRadius: 8, // Increased corner radius for a more modern look
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
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff', // White text color for buttons
    fontSize: 18, // Increased font size for better readability
    fontWeight: '600', // Semi-bold font weight for buttons
  },
  deleteButton: {
    backgroundColor: '#e74c3c', // Red button background
    borderRadius: 8, // Increased corner radius for a more modern look
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
    elevation: 2,
  },
  deleteButtonText: {
    color: '#ffffff', // White text color for buttons
    fontSize: 18, // Increased font size for better readability
    fontWeight: '600', // Semi-bold font weight for buttons
  },
});

export default styles;